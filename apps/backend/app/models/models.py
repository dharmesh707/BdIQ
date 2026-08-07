import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, ForeignKey, Enum, DateTime, JSON, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import enum

class Handedness(enum.Enum):
    R = "R"
    L = "L"


class ShotType(enum.Enum):
    FH_SMASH    = "FH_SMASH"
    BH_SMASH    = "BH_SMASH"
    STICK_SMASH = "STICK_SMASH"
    JUMP_SMASH  = "JUMP_SMASH"
    FH_CLEAR    = "FH_CLEAR"
    BH_CLEAR    = "BH_CLEAR"
    FH_DROP     = "FH_DROP"
    BH_DROP     = "BH_DROP"
    FH_DRIVE    = "FH_DRIVE"
    BH_DRIVE    = "BH_DRIVE"
    NET_PUSH    = "NET_PUSH"

class DeviceMode(enum.Enum):
    HIGH_QUALITY = "HIGH_QUALITY"
    STANDARD     = "STANDARD"
    ASSISTED     = "ASSISTED"

VALID_SHOT_TYPES = (
    "FH_SMASH", "BH_SMASH", "STICK_SMASH", "JUMP_SMASH",
    "FH_CLEAR", "BH_CLEAR",
    "FH_DROP", "BH_DROP",
    "FH_DRIVE", "BH_DRIVE",
    "NET_PUSH",
)

VALID_SKILL_CATEGORIES = ("smash", "drive", "drop", "netPlay", "footwork")


class User(Base):
    __tablename__ = "users"

    id:                  Mapped[str]        = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email:               Mapped[str]        = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password:     Mapped[str]        = mapped_column(String, nullable=False)
    height_cm:           Mapped[int | None] = mapped_column(Integer, nullable=True)
    handedness:          Mapped[Handedness] = mapped_column(Enum(Handedness), default=Handedness.R)
    primary_template_id: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at:          Mapped[datetime]   = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    sessions:   Mapped[list["Session"]]         = relationship("Session", back_populates="user")
    analyses:   Mapped[list["Analysis"]]        = relationship("Analysis", back_populates="user")
    baselines:  Mapped[list["PersonalBaseline"]] = relationship("PersonalBaseline", back_populates="user")
    skill_cards: Mapped[list["SkillCard"]]       = relationship("SkillCard", back_populates="user")
    training_completions: Mapped[list["TrainingCompletion"]] = relationship("TrainingCompletion", back_populates="user")


class Session(Base):
    __tablename__ = "sessions"

    id:                Mapped[str]          = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id:           Mapped[str]          = mapped_column(String, ForeignKey("users.id"), index=True)
    recorded_at:       Mapped[datetime]     = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    duration_s:        Mapped[float | None] = mapped_column(Float, nullable=True)
    avg_posture_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    device_mode:       Mapped[DeviceMode]   = mapped_column(Enum(DeviceMode), default=DeviceMode.STANDARD)

    user:  Mapped["User"]       = relationship("User", back_populates="sessions")
    shots: Mapped[list["Shot"]] = relationship("Shot", back_populates="session")


class Shot(Base):
    __tablename__ = "shots"

    id:              Mapped[str]          = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id:      Mapped[str]          = mapped_column(String, ForeignKey("sessions.id"), index=True)
    shot_type:       Mapped[str | None]   = mapped_column(String, nullable=True)
    posture_score:   Mapped[float | None] = mapped_column(Float, nullable=True)
    smash_speed_kmh: Mapped[float | None] = mapped_column(Float, nullable=True)
    corrections:     Mapped[dict | None]  = mapped_column(JSON, nullable=True)

    __table_args__ = (
        CheckConstraint(f"shot_type IN {VALID_SHOT_TYPES}", name="ck_shots_shot_type_valid"),
    )

    session: Mapped["Session"] = relationship("Session", back_populates="shots")


class Analysis(Base):
    """Persists every analysis result so history endpoint returns real data."""
    __tablename__ = "analyses"

    id:            Mapped[str]          = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id:       Mapped[str]          = mapped_column(String, ForeignKey("users.id"), index=True)   # NEW — was orphaned in v1.0
    session_id:    Mapped[str | None]   = mapped_column(String, ForeignKey("sessions.id"), nullable=True, index=True)  # NEW
    video_path:    Mapped[str | None]   = mapped_column(String, nullable=True)
    shot_type:     Mapped[str | None]   = mapped_column(String, nullable=True)
    overall_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    result_json:   Mapped[dict | None]  = mapped_column(JSON, nullable=True)
    created_at:    Mapped[datetime]     = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(f"shot_type IN {VALID_SHOT_TYPES}", name="ck_analyses_shot_type_valid"),
    )

    user: Mapped["User"] = relationship("User", back_populates="analyses")


class PersonalBaseline(Base):
    """
    One row per (user, shot_type). Rolling average of key metrics from the
    user's own historical analyses for that shot — this is what live shots
    get compared against for soft-deviation detection (Freedom-to-Play).
    Recomputed/updated after each new Analysis for that shot_type.
    """
    __tablename__ = "personal_baselines"

    id:                Mapped[str]        = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id:           Mapped[str]        = mapped_column(String, ForeignKey("users.id"), index=True)
    shot_type:         Mapped[str]        = mapped_column(String, nullable=False)
    sample_count:      Mapped[int]        = mapped_column(Integer, default=0)          # how many analyses fed this baseline
    avg_joint_angles:  Mapped[dict | None] = mapped_column(JSON, nullable=True)         # {"shoulder": 112.3, "elbow": 71.8, ...}
    avg_overall_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    stddev_joint_angles: Mapped[dict | None] = mapped_column(JSON, nullable=True)       # for soft-deviation threshold calc
    updated_at:        Mapped[datetime]   = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("user_id", "shot_type", name="uq_baseline_user_shot"),
        CheckConstraint(f"shot_type IN {VALID_SHOT_TYPES}", name="ck_baseline_shot_type_valid"),
    )

    user: Mapped["User"] = relationship("User", back_populates="baselines")


class SkillCard(Base):
    """
    One row per (user, skill_category). Powers the Home Dashboard Skill
    Cards (F-08) — mirrors the 5 categories already rendered by
    SkillBreakdownCard.tsx: smash, drive, drop, netPlay, footwork.
    """
    __tablename__ = "skill_cards"

    id:               Mapped[str]        = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id:          Mapped[str]        = mapped_column(String, ForeignKey("users.id"), index=True)
    skill_category:   Mapped[str]        = mapped_column(String, nullable=False)   # smash | drive | drop | netPlay | footwork
    current_score:    Mapped[float]      = mapped_column(Float, default=0.0)       # matches SkillBar's 0-100 value
    previous_score:   Mapped[float | None] = mapped_column(Float, nullable=True)   # for trend arrow (up/down/flat)
    sessions_tracked: Mapped[int]        = mapped_column(Integer, default=0)
    updated_at:       Mapped[datetime]   = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("user_id", "skill_category", name="uq_skillcard_user_category"),
        CheckConstraint(f"skill_category IN {VALID_SKILL_CATEGORIES}", name="ck_skillcard_category_valid"),
    )

    user: Mapped["User"] = relationship("User", back_populates="skill_cards")


class TrainingCompletion(Base):
    """Stores completed training drills so progress can include training activity."""
    __tablename__ = "training_completions"

    id:           Mapped[str]      = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))  # was training_id as PK — fixed, see note below
    user_id:      Mapped[str]      = mapped_column(String, ForeignKey("users.id"), index=True)   # NEW
    training_id:  Mapped[str]      = mapped_column(String, index=True, nullable=False)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="training_completions")