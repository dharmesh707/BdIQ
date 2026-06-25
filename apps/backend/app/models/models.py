import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.database import Base
import enum

class Handedness(enum.Enum):
    R = "R"
    L = "L"

class ShotType(enum.Enum):
    FH_SMASH  = "FH_SMASH"
    BH_SMASH  = "BH_SMASH"
    FH_CLEAR  = "FH_CLEAR"
    BH_CLEAR  = "BH_CLEAR"
    FH_DROP   = "FH_DROP"
    BH_DROP   = "BH_DROP"
    FH_DRIVE  = "FH_DRIVE"
    NET_PUSH  = "NET_PUSH"

class DeviceMode(enum.Enum):
    HIGH_QUALITY = "HIGH_QUALITY"
    STANDARD     = "STANDARD"
    ASSISTED     = "ASSISTED"

class User(Base):
    __tablename__ = "users"

    id:                 Mapped[uuid.UUID]         = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email:              Mapped[str]               = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password:    Mapped[str]               = mapped_column(String, nullable=False)
    height_cm:          Mapped[int | None]         = mapped_column(Integer, nullable=True)
    handedness:         Mapped[Handedness]         = mapped_column(Enum(Handedness), default=Handedness.R)
    primary_template_id: Mapped[str | None]        = mapped_column(String, nullable=True)
    created_at:         Mapped[datetime]           = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    sessions: Mapped[list["Session"]] = relationship("Session", back_populates="user")

class Session(Base):
    __tablename__ = "sessions"

    id:                Mapped[uuid.UUID]    = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id:           Mapped[uuid.UUID]    = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    recorded_at:       Mapped[datetime]     = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    duration_s:        Mapped[float | None] = mapped_column(Float, nullable=True)
    avg_posture_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    device_mode:       Mapped[DeviceMode]   = mapped_column(Enum(DeviceMode), default=DeviceMode.STANDARD)

    user:  Mapped["User"]       = relationship("User", back_populates="sessions")
    shots: Mapped[list["Shot"]] = relationship("Shot", back_populates="session")

class Shot(Base):
    __tablename__ = "shots"

    id:               Mapped[uuid.UUID]     = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id:       Mapped[uuid.UUID]     = mapped_column(UUID(as_uuid=True), ForeignKey("sessions.id"), index=True)
    shot_type:        Mapped[ShotType]      = mapped_column(Enum(ShotType))
    posture_score:    Mapped[float | None]  = mapped_column(Float, nullable=True)
    smash_speed_kmh:  Mapped[float | None]  = mapped_column(Float, nullable=True)
    corrections:      Mapped[dict | None]   = mapped_column(JSONB, nullable=True)

    session: Mapped["Session"] = relationship("Session", back_populates="shots")