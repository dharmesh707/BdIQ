"""
BadmintonIQ ML Pipeline

Flow:
  video file
    → validate (is this actually a video with a person in it?)
    → extract frames (OpenCV)
    → pose detection per frame (MediaPipe PoseLandmarker)
    → find contact frame (peak wrist velocity)
    → calculate joint angles
    → score biomechanics against pro template
    → classify shot type
    → build AnalysisResponse

IMPORTANT: This pipeline never falls back to mock/hardcoded data.
If MediaPipe cannot detect a pose, it raises a clear error that
the frontend displays to the user instead of returning fake results.
"""

import os
import uuid
import math
import logging
import numpy as np
from typing import Optional

logger = logging.getLogger(__name__)

# ── MediaPipe ─────────────────────────────────────────────────────────────────
try:
    import mediapipe as mp
    from mediapipe.tasks.python import vision as mp_vision
    from mediapipe.tasks.python import BaseOptions
    MEDIAPIPE_AVAILABLE = True
    logger.info("MediaPipe loaded successfully")
except ImportError as e:
    MEDIAPIPE_AVAILABLE = False
    logger.warning(f"MediaPipe not available: {e}")

# ── OpenCV ────────────────────────────────────────────────────────────────────
try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False
    logger.warning("OpenCV not available")

from app.schemas.schemas import (
    AnalysisResponse, ProfessionalComparison, AnalysisMetrics,
    AnalysisJointAngles, DrillRecommendation
)

# ── MediaPipe landmark indices ─────────────────────────────────────────────────
LM = {
    "nose": 0,
    "l_shoulder": 11, "r_shoulder": 12,
    "l_elbow": 13,    "r_elbow": 14,
    "l_wrist": 15,    "r_wrist": 16,
    "l_hip": 23,      "r_hip": 24,
    "l_knee": 25,     "r_knee": 26,
    "l_ankle": 27,    "r_ankle": 28,
}

# ── Pro templates ──────────────────────────────────────────────────────────────
PRO_TEMPLATES = {
    "viktor_axelson": {
        "elbow_angle": 165,
        "shoulder_elevation": 175,
        "knee_angle": 155,
        "hip_shoulder_separation": 45,
        "torso_inclination": 15,
    },
    "kento_momota": {
        "elbow_angle": 158,
        "shoulder_elevation": 170,
        "knee_angle": 150,
        "hip_shoulder_separation": 40,
        "torso_inclination": 20,
    },
}

DRILL_LIBRARY = {
    "elbow_angle": DrillRecommendation(
        title="Shadow Smash", duration="5 min", difficulty="Intermediate"),
    "shoulder_elevation": DrillRecommendation(
        title="High Contact Point Drill", duration="3 min", difficulty="Beginner"),
    "knee_angle": DrillRecommendation(
        title="Split Step Practice", duration="4 min", difficulty="Beginner"),
    "hip_shoulder_separation": DrillRecommendation(
        title="Rotation Power Drill", duration="6 min", difficulty="Intermediate"),
    "torso_inclination": DrillRecommendation(
        title="Balance Board Swings", duration="5 min", difficulty="Advanced"),
}

# Model path — must be downloaded manually and placed here
MODEL_PATH = os.path.join(os.path.dirname(__file__), "pose_landmarker.task")
MODEL_URL = (
    "https://storage.googleapis.com/mediapipe-models/"
    "pose_landmarker/pose_landmarker_lite/float16/latest/"
    "pose_landmarker_lite.task"
)

# Minimum frames that must have a detected pose for the video to be valid
MIN_POSE_FRAMES = 5
# Minimum detection rate (fraction of frames with a pose)
MIN_DETECTION_RATE = 0.3


def _ensure_model_available() -> bool:
    """
    Check if the model file exists and is valid.
    Try to download it if not present.
    Returns True if model is ready, False if unavailable.
    """
    if os.path.exists(MODEL_PATH) and os.path.getsize(MODEL_PATH) > 100_000:
        return True

    # Try to download
    try:
        import urllib.request
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        logger.info(f"Downloading MediaPipe pose model to {MODEL_PATH}...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        if os.path.exists(MODEL_PATH) and os.path.getsize(MODEL_PATH) > 100_000:
            logger.info("Model downloaded successfully")
            return True
        else:
            logger.error("Model download produced empty file")
            return False
    except Exception as e:
        logger.error(f"Failed to download model: {e}")
        return False


def _angle_between(a: tuple, b: tuple, c: tuple) -> float:
    """
    Angle at point B in the A-B-C triangle, in degrees.
    Points are (x, y) normalised 0-1 from MediaPipe.
    """
    ba = (a[0] - b[0], a[1] - b[1])
    bc = (c[0] - b[0], c[1] - b[1])
    dot = ba[0] * bc[0] + ba[1] * bc[1]
    mag_ba = math.sqrt(ba[0] ** 2 + ba[1] ** 2)
    mag_bc = math.sqrt(bc[0] ** 2 + bc[1] ** 2)
    if mag_ba * mag_bc == 0:
        return 0.0
    cos_angle = max(-1.0, min(1.0, dot / (mag_ba * mag_bc)))
    return math.degrees(math.acos(cos_angle))


def _extract_angles_from_landmarks(landmarks) -> dict:
    """
    Compute joint angles from a single frame's MediaPipe landmarks.
    """
    def pt(name):
        lm = landmarks[LM[name]]
        return (lm.x, lm.y)

    r_shoulder = pt("r_shoulder")
    r_elbow    = pt("r_elbow")
    r_wrist    = pt("r_wrist")
    r_hip      = pt("r_hip")
    r_knee     = pt("r_knee")
    r_ankle    = pt("r_ankle")
    l_shoulder = pt("l_shoulder")
    l_hip      = pt("l_hip")

    elbow_angle        = _angle_between(r_shoulder, r_elbow, r_wrist)
    shoulder_elevation = _angle_between(r_elbow, r_shoulder, r_hip)
    knee_angle         = _angle_between(r_hip, r_knee, r_ankle)

    # Hip-shoulder separation
    sv = (r_shoulder[0] - l_shoulder[0], r_shoulder[1] - l_shoulder[1])
    hv = (r_hip[0] - l_hip[0], r_hip[1] - l_hip[1])
    mag_s = math.sqrt(sv[0] ** 2 + sv[1] ** 2)
    mag_h = math.sqrt(hv[0] ** 2 + hv[1] ** 2)
    if mag_s * mag_h > 0:
        cos_sep = max(-1.0, min(1.0, (sv[0]*hv[0] + sv[1]*hv[1]) / (mag_s * mag_h)))
        hip_shoulder_separation = math.degrees(math.acos(cos_sep))
    else:
        hip_shoulder_separation = 0.0

    # Torso inclination from vertical
    spine = (r_shoulder[0] - r_hip[0], r_shoulder[1] - r_hip[1])
    mag_sp = math.sqrt(spine[0] ** 2 + spine[1] ** 2)
    if mag_sp > 0:
        cos_tilt = max(-1.0, min(1.0, -spine[1] / mag_sp))  # dot with (0,-1)
        torso_inclination = math.degrees(math.acos(cos_tilt))
    else:
        torso_inclination = 0.0

    return {
        "elbow_angle":             round(elbow_angle, 1),
        "shoulder_elevation":      round(shoulder_elevation, 1),
        "knee_angle":              round(knee_angle, 1),
        "hip_shoulder_separation": round(hip_shoulder_separation, 1),
        "torso_inclination":       round(torso_inclination, 1),
    }


def _extract_contact_frame_angles(video_path: str) -> dict:
    """
    Run MediaPipe on the video, find the contact frame, return joint angles.

    Raises ValueError with a user-friendly message if:
    - MediaPipe is not available
    - Model file is missing
    - The video has no detectable person in it (e.g. cat meme, blank video)
    - Too few frames have pose detections
    """
    if not MEDIAPIPE_AVAILABLE:
        raise ValueError(
            "Pose estimation library is not installed on the server. "
            "Contact support."
        )

    if not CV2_AVAILABLE:
        raise ValueError(
            "Video processing library is not installed on the server. "
            "Contact support."
        )

    if not _ensure_model_available():
        raise ValueError(
            "Pose estimation model is not available on the server. "
            "Please manually download pose_landmarker.task and place it in app/ml/. "
            "Download from: " + MODEL_URL
        )

    # Open video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(
            "Could not open the uploaded video file. "
            "Please upload a valid .mp4 or .mov file."
        )

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    duration_s = total_frames / fps

    logger.info(f"Video: {total_frames} frames, {fps:.1f}fps, {duration_s:.1f}s")

    # Reject very short clips (less than 1 second)
    if total_frames < 10:
        cap.release()
        raise ValueError(
            f"Video is too short ({total_frames} frames). "
            "Please upload a clip of at least 1-2 seconds showing your stroke."
        )

    # Build landmarker
    try:
        options = mp_vision.PoseLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=MODEL_PATH),
    running_mode=mp_vision.RunningMode.IMAGE,
    num_poses=1,
    min_pose_detection_confidence=0.4,
    min_pose_presence_confidence=0.4,   # ← correct name
    min_tracking_confidence=0.4,
)
        landmarker = mp_vision.PoseLandmarker.create_from_options(options)
    except Exception as e:
        cap.release()
        raise ValueError(f"Failed to initialise pose estimator: {str(e)}")

    frames_data = []
    frames_processed = 0

    # Sample every other frame for speed on long videos
    frame_step = max(1, int(fps / 15))  # process at ~15fps equivalent

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames_processed += 1
        if frames_processed % frame_step != 0:
            continue

        try:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            result = landmarker.detect(mp_image)
            if result.pose_landmarks:
                lms = result.pose_landmarks[0]
                frames_data.append(lms)
        except Exception:
            continue  # Skip corrupted frames

    cap.release()
    landmarker.close()

    frames_sampled = max(1, frames_processed // frame_step)
    detection_rate = len(frames_data) / frames_sampled

    logger.info(
        f"Pose detection: {len(frames_data)}/{frames_sampled} frames "
        f"({detection_rate:.0%} detection rate)"
    )

    # Reject if no person detected — catches cat memes, blank videos, etc.
    if len(frames_data) < MIN_POSE_FRAMES:
        raise ValueError(
            f"No person detected in the video "
            f"({len(frames_data)} frames with pose out of {frames_sampled} sampled). "
            "Please upload a video showing a full-body badminton stroke. "
            "Make sure the person is clearly visible and not too far from the camera."
        )

    if detection_rate < MIN_DETECTION_RATE:
        raise ValueError(
            f"Person was only detected in {detection_rate:.0%} of video frames. "
            "Please ensure the player is clearly visible throughout the stroke. "
            "Try recording from further back so the full body is in frame."
        )

    # Find contact frame: frame where right wrist has peak velocity (= racket swing)
    wrist_y = [lms[LM["r_wrist"]].y for lms in frames_data]
    if len(wrist_y) >= 3:
        velocities = [abs(wrist_y[i] - wrist_y[i - 1]) for i in range(1, len(wrist_y))]
        contact_idx = int(np.argmax(velocities))
    else:
        contact_idx = 0

    contact_landmarks = frames_data[contact_idx]
    angles = _extract_angles_from_landmarks(contact_landmarks)

    logger.info(f"Angles at contact frame {contact_idx}: {angles}")
    return angles


def _classify_shot_rule_based(angles: dict) -> str:
    """
    Rule-based shot classification from joint angles.
    Returns one of the DB-valid shot_type codes (see VALID_SHOT_TYPES in models.py).
    """
    elbow    = angles.get("elbow_angle", 150)
    shoulder = angles.get("shoulder_elevation", 120)
    torso    = angles.get("torso_inclination", 15)

    if shoulder > 140 and elbow > 150:
        return "STICK_SMASH" if torso < 20 else "JUMP_SMASH"
    elif shoulder > 120 and elbow > 140:
        return "FH_CLEAR"
    elif elbow < 130:
        return "FH_DROP"
    else:
        return "FH_DRIVE"

def _score_against_template(
    angles: dict, template_id: str = "viktor_axelson"
) -> tuple[float, list, list, list]:
    """
    Compare angles against pro template.
    Returns (score 0-100, mistakes[], strengths[], drills[])
    """
    template = PRO_TEMPLATES.get(template_id, PRO_TEMPLATES["viktor_axelson"])

    checks = [
        ("elbow_angle",             0.30, 40,
         "Extend arm more fully at contact — elbow should be near straight.",
         "Good arm extension at contact."),
        ("shoulder_elevation",      0.25, 25,
         "Contact point too low — hit the shuttle above shoulder height.",
         "Excellent contact point height."),
        ("knee_angle",              0.20, 30,
         "Add more knee bend in your stance — improves balance and power.",
         "Good knee bend in stance."),
        ("hip_shoulder_separation", 0.25, 35,
         "Increase trunk rotation — power in smash comes from the hips.",
         "Strong hip rotation."),
    ]

    penalty = 0.0
    mistakes, strengths, drills = [], [], []

    for key, weight, max_dev, mistake_msg, strength_msg in checks:
        user_val = angles.get(key, 0.0)
        ideal    = template[key]
        dev      = abs(user_val - ideal)
        penalty += min(dev / max_dev, 1.0) * weight * 100

        if dev > max_dev * 0.25:
            mistakes.append(mistake_msg)
            if key in DRILL_LIBRARY:
                drills.append(DRILL_LIBRARY[key])
        else:
            strengths.append(strength_msg)

    score = round(max(0.0, min(100.0, 100.0 - penalty)), 1)
    return score, mistakes[:3], strengths[:2], drills[:3]


def _compute_similarity(angles: dict, template_id: str) -> float:
    """
    Cosine similarity between user angle vector and pro template.
    Returns percentage 0-100.
    Uses angular difference normalised by expected range — more meaningful
    than raw cosine on absolute degree values.
    """
    template = PRO_TEMPLATES.get(template_id, PRO_TEMPLATES["viktor_axelson"])
    max_devs = {
        "elbow_angle": 40,
        "shoulder_elevation": 25,
        "knee_angle": 30,
        "hip_shoulder_separation": 35,
        "torso_inclination": 20,
    }
    total_weight = 0.0
    similarity_score = 0.0

    for key, ideal in template.items():
        user_val = angles.get(key, ideal)
        max_dev  = max_devs.get(key, 30)
        dev      = abs(user_val - ideal)
        match    = max(0.0, 1.0 - (dev / max_dev))
        similarity_score += match
        total_weight += 1.0

    if total_weight == 0:
        return 50.0

    return round((similarity_score / total_weight) * 100, 1)


def run_analysis_pipeline(
    video_path: str,
    template_id: str = "viktor_axelson"
) -> AnalysisResponse:
    """
    Main entry point. Runs real MediaPipe analysis on the video.

    Raises ValueError with a user-friendly message if:
    - The video has no detectable person
    - MediaPipe is not available
    - The model file is missing

    NEVER falls back to hardcoded/mock data.
    """
    analysis_id = str(uuid.uuid4())

    # This raises ValueError if no person detected — do not catch it here.
    # The endpoint will convert it to a 422 response with the error message.
    angles = _extract_contact_frame_angles(video_path)

    shot_type     = _classify_shot_rule_based(angles)
    score, mistakes, strengths, drills = _score_against_template(angles, template_id)
    similarity    = _compute_similarity(angles, template_id)

    elbow_score    = max(0.0, 100.0 - abs(angles["elbow_angle"] - 165) * 2)
    shoulder_score = max(0.0, 100.0 - abs(angles["shoulder_elevation"] - 175) * 1.5)
    knee_score     = max(0.0, 100.0 - abs(angles["knee_angle"] - 155) * 2)
    hip_score      = max(0.0, 100.0 - abs(angles["hip_shoulder_separation"] - 45) * 1.5)

    logger.info(
        f"Analysis complete: shot={shot_type}, score={score}, "
        f"similarity={similarity}, angles={angles}"
    )

    return AnalysisResponse(
        analysisId=analysis_id,
        overallScore=score,
        shotType=shot_type,
        professionalComparison=ProfessionalComparison(
            player="Viktor Axelson",
            similarity=similarity,
        ),
        metrics=AnalysisMetrics(
            smashPower=round(elbow_score * 0.6 + shoulder_score * 0.4, 1),
            footwork=round(knee_score, 1),
            timing=round(shoulder_score, 1),
            balance=round((knee_score + hip_score) / 2, 1),
            recovery=round(hip_score, 1),
        ),
        jointAngles=AnalysisJointAngles(
            shoulder=angles["shoulder_elevation"],
            elbow=angles["elbow_angle"],
            hip=angles["hip_shoulder_separation"],
            knee=angles["knee_angle"],
        ),
        mistakes=mistakes if mistakes else ["Technique looks solid — keep practising!"],
        strengths=strengths if strengths else ["Good effort on this stroke."],
        recommendations=drills if drills else [
            DrillRecommendation(title="Shadow Swing Practice", duration="5 min", difficulty="Beginner"),
        ],
    )


def mock_analysis_response(analysis_id: str) -> AnalysisResponse:
    """
    Only used by GET /analyze/{id} when an old analysis_id is not found in DB.
    Never used by POST /analyze.
    """
    return AnalysisResponse(
        analysisId=analysis_id,
        overallScore=91,
        shotType="Stick Smash",
        professionalComparison=ProfessionalComparison(player="Viktor Axelson", similarity=82),
        metrics=AnalysisMetrics(smashPower=88, footwork=79, timing=84, balance=81, recovery=86),
        jointAngles=AnalysisJointAngles(shoulder=171, elbow=156, hip=167, knee=143),
        mistakes=["Elbow drops before impact", "Late hip rotation"],
        strengths=["Excellent timing", "Good follow through"],
        recommendations=[
            DrillRecommendation(title="Shadow Stick Smash", duration="5 min", difficulty="Intermediate"),
            DrillRecommendation(title="Hip Rotation Drill",  duration="4 min", difficulty="Intermediate"),
        ],
    )