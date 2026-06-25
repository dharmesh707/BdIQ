from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, Session as SessionModel
from app.schemas.schemas import SessionCreate, SessionOut

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.post("", response_model=SessionOut, status_code=201)
def create_session(
    payload: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = SessionModel(
        user_id=current_user.id,
        duration_s=payload.duration_s,
        device_mode=payload.device_mode,
    )
    db.add(session); db.commit(); db.refresh(session)
    return session

@router.get("", response_model=list[SessionOut])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(SessionModel).filter(
        SessionModel.user_id == current_user.id
    ).order_by(SessionModel.recorded_at.desc()).all()