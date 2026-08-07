"""
POST /upload
Accepts a video file, saves it, transcodes to H.264 if needed,
returns a video_id for use with POST /analyze.

Transcoding ensures OpenCV/MediaPipe can open ANY video regardless
of what codec the phone used to record it.
"""

import os
import uuid
import subprocess
import logging
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.core.config import settings
from app.schemas.schemas import UploadResponse

router = APIRouter(prefix="/upload", tags=["upload"])
logger = logging.getLogger(__name__)

ALLOWED_TYPES = {
    "video/mp4", "video/quicktime", "video/x-msvideo",
    "video/mpeg", "video/webm", "video/3gpp",
    "application/octet-stream",  # some phones send this
}
MAX_BYTES = settings.MAX_VIDEO_SIZE_MB * 1024 * 1024


def _ffmpeg_available() -> bool:
    try:
        subprocess.run(
            ["ffmpeg", "-version"],
            capture_output=True, check=True
        )
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        return False


def _transcode_to_h264(input_path: str, output_path: str) -> bool:
    """
    Transcode video to H.264 MP4 so OpenCV can reliably open it.
    Returns True if successful, False if ffmpeg is unavailable or fails.
    """
    try:
        result = subprocess.run([
            "ffmpeg", "-y",
            "-i", input_path,
            "-vcodec", "libx264",
            "-acodec", "aac",
            "-preset", "fast",
            "-crf", "23",
            "-vf", "scale=640:-2",   # resize to max 640px wide for faster processing
            "-movflags", "+faststart",
            output_path
        ], capture_output=True, timeout=120)

        if result.returncode == 0 and os.path.exists(output_path):
            logger.info(f"Transcoded {input_path} → {output_path}")
            return True
        else:
            logger.warning(f"ffmpeg failed: {result.stderr.decode()[:200]}")
            return False
    except Exception as e:
        logger.warning(f"Transcoding error: {e}")
        return False


def _can_opencv_open(path: str) -> bool:
    """Quick check if OpenCV can open this file."""
    try:
        import cv2
        cap = cv2.VideoCapture(path)
        opened = cap.isOpened()
        if opened:
            ret, _ = cap.read()
            opened = ret
        cap.release()
        return opened
    except Exception:
        return False


@router.post("", response_model=UploadResponse)
async def upload_video(file: UploadFile = File(...)):
    # Content type check — be lenient since mobile apps vary
    if file.content_type and file.content_type not in ALLOWED_TYPES:
        # Allow through anyway if it looks like a video by filename
        filename = file.filename or ""
        if not any(filename.lower().endswith(ext)
                   for ext in [".mp4", ".mov", ".avi", ".3gp", ".webm", ".mpeg"]):
            raise HTTPException(
                status_code=415,
                detail=f"Unsupported file type: {file.content_type}. Upload a video file."
            )

    contents = await file.read()

    if len(contents) < 1000:
        raise HTTPException(
            status_code=400,
            detail="File is empty or too small. Please upload a valid video."
        )

    if len(contents) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_VIDEO_SIZE_MB}MB."
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    video_id = str(uuid.uuid4())
    original_ext = os.path.splitext(file.filename or "video.mp4")[1].lower() or ".mp4"
    raw_path = os.path.join(settings.UPLOAD_DIR, f"{video_id}_raw{original_ext}")
    final_path = os.path.join(settings.UPLOAD_DIR, f"{video_id}.mp4")

    # Save raw upload
    with open(raw_path, "wb") as f:
        f.write(contents)

    # Try to transcode to H.264 for reliable OpenCV compatibility
    transcoded = False
    if _ffmpeg_available():
        transcoded = _transcode_to_h264(raw_path, final_path)
        if transcoded:
            os.remove(raw_path)  # clean up raw file
        else:
            # Transcoding failed — try using raw file directly
            os.rename(raw_path, final_path)
    else:
        # No ffmpeg — use raw file and hope OpenCV can handle it
        os.rename(raw_path, final_path)
        logger.warning(
            "ffmpeg not available — skipping transcoding. "
            "Some video formats may not be readable by OpenCV."
        )

    # Quick sanity check
    if not _can_opencv_open(final_path):
        os.remove(final_path)
        raise HTTPException(
            status_code=422,
            detail=(
                "Video file could not be processed. "
                "Please upload an MP4 video recorded on your phone. "
                "Make sure the video is not corrupted."
            )
        )

    logger.info(
        f"Upload complete: video_id={video_id}, "
        f"size={len(contents)/1024:.0f}KB, transcoded={transcoded}"
    )

    return UploadResponse(
        video_id=video_id,
        filename=file.filename or f"{video_id}.mp4",
        size_bytes=len(contents),
        message="Video uploaded and ready for analysis."
    )