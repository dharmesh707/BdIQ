from pydantic import BaseModel, EmailStr

from datetime import datetime
from typing import Literal, Optional
from app.models.models import ShotType, DeviceMode

# ── Auth ──────────────────────────────────────────────────────────────────────
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    height_cm: Optional[int] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: str
    email: str
    height_cm: Optional[int]
    primary_template_id: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}

# ── Sessions ──────────────────────────────────────────────────────────────────
class SessionCreate(BaseModel):
    duration_s: Optional[float] = None
    device_mode: DeviceMode = DeviceMode.STANDARD

class SessionOut(BaseModel):
    id: str
    user_id: str
    recorded_at: datetime
    avg_posture_score: Optional[float]
    device_mode: DeviceMode

    model_config = {"from_attributes": True}

# ── Shots ─────────────────────────────────────────────────────────────────────
class CorrectionItem(BaseModel):
    joint: str
    deviation_degrees: float
    user_value: float
    template_value: float
    description: str
    severity: str

class ShotCreate(BaseModel):
    shot_type: ShotType
    joint_angles: dict
    template_id: str = "viktor_axelson"
    smash_speed_kmh: Optional[float] = None

class ShotOut(BaseModel):
    id: str
    session_id: str
    shot_type: ShotType
    posture_score: Optional[float]
    smash_speed_kmh: Optional[float]
    corrections: Optional[list[CorrectionItem]]

    model_config = {"from_attributes": True}

# ── Upload ────────────────────────────────────────────────────────────────────
class UploadResponse(BaseModel):
    video_id: str
    filename: str
    size_bytes: int
    message: str

# ── Analysis — exact shape the frontend expects ───────────────────────────────
class ProfessionalComparison(BaseModel):
    player: str
    similarity: float

class AnalysisMetrics(BaseModel):
    smashPower: float
    footwork: float
    timing: float
    balance: float
    recovery: float

class AnalysisJointAngles(BaseModel):
    shoulder: float
    elbow: float
    hip: float
    knee: float

class DrillRecommendation(BaseModel):
    title: str
    duration: str
    difficulty: str

class AnalysisResponse(BaseModel):
    """
    This is the exact JSON shape the React Native frontend expects.
    Every field here maps 1:1 to what the frontend reads.
    """
    analysisId: str
    overallScore: float
    shotType: str
    professionalComparison: ProfessionalComparison
    metrics: AnalysisMetrics
    jointAngles: AnalysisJointAngles
    mistakes: list[str]
    strengths: list[str]
    recommendations: list[DrillRecommendation]

# ── Dashboard ─────────────────────────────────────────────────────────────────
class SkillBreakdown(BaseModel):
    smash: float
    drive: float
    drop: float
    netPlay: float
    footwork: float

class RecentSession(BaseModel):
    shotType: str
    score: float
    date: str

class DashboardResponse(BaseModel):
    overallScore: float
    weeklyProgress: float
    streak: int
    skillBreakdown: SkillBreakdown
    recentSessions: list[RecentSession]
    coachInsight: str


# ── Training ──────────────────────────────────────────────────────────────────
class TrainingDrill(BaseModel):
    id: str
    title: str
    description: str
    duration: str
    difficulty: Literal["Easy", "Medium", "Hard"]
    targetMetric: str
    expectedImprovement: str
    reason: str
    completed: bool = False


class TrainingTodayResponse(BaseModel):
    drills: list[TrainingDrill]


class TrainingCompleteRequest(BaseModel):
    trainingId: str


class TrainingCompleteResponse(BaseModel):
    success: bool = True

# ── Progress ──────────────────────────────────────────────────────────────────
class ProgressResponse(BaseModel):
    smash: float
    drop: float
    drive: float
    clear: float
    footwork: float
    timing: float
    consistency: float
    lastUpdated: str