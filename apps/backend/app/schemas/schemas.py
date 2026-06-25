from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.models import ShotType, DeviceMode

# ── Auth ──────────────────────────────────────────────────────────────────
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
    id: UUID
    email: str
    height_cm: Optional[int]
    primary_template_id: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}

# ── Sessions ──────────────────────────────────────────────────────────────
class SessionCreate(BaseModel):
    duration_s: Optional[float] = None
    device_mode: DeviceMode = DeviceMode.STANDARD

class SessionOut(BaseModel):
    id: UUID
    user_id: UUID
    recorded_at: datetime
    avg_posture_score: Optional[float]
    device_mode: DeviceMode

    model_config = {"from_attributes": True}

# ── Shots ─────────────────────────────────────────────────────────────────
class CorrectionItem(BaseModel):
    joint: str
    deviation_degrees: float
    user_value: float
    template_value: float
    description: str
    severity: str

class ShotCreate(BaseModel):
    shot_type: ShotType
    joint_angles: dict          # raw angles from on-device pipeline
    template_id: str = "viktor_axelson"
    smash_speed_kmh: Optional[float] = None

class ShotOut(BaseModel):
    id: UUID
    session_id: UUID
    shot_type: ShotType
    posture_score: Optional[float]
    smash_speed_kmh: Optional[float]
    corrections: Optional[list[CorrectionItem]]

    model_config = {"from_attributes": True}