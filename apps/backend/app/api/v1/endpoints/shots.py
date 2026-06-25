from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, Session as SessionModel, Shot
from app.schemas.schemas import ShotCreate, ShotOut
from app.services.analysis import score_shot

router = APIRouter(prefix="/sessions", tags=["shots"])

@router.post("/{session_id}/shots", response_model=ShotOut, status_code=201)
def add_shot(
    session_id: UUID,
    payload: ShotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    score, corrections = score_shot(payload.joint_angles, payload.template_id)

    shot = Shot(
        session_id=session_id,
        shot_type=payload.shot_type,
        posture_score=score,
        smash_speed_kmh=payload.smash_speed_kmh,
        corrections=corrections,
    )
    db.add(shot); db.commit(); db.refresh(shot)
    return shot