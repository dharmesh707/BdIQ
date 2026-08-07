"""
GET /training/today
POST /training/complete
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Analysis, TrainingCompletion
from app.schemas.schemas import (
    AnalysisResponse,
    TrainingCompleteRequest,
    TrainingCompleteResponse,
    TrainingTodayResponse,
)
from app.services.recommendation_engine import recommendation_engine

router = APIRouter(prefix="/training", tags=["training"])


def _load_latest_analysis(db: Session) -> AnalysisResponse | None:
    analysis = db.query(Analysis).order_by(desc(Analysis.created_at)).first()
    if not analysis or not analysis.result_json:
        return None

    return AnalysisResponse(**analysis.result_json)


@router.get("/today", response_model=TrainingTodayResponse)
def get_training_today(db: Session = Depends(get_db)):
    latest_analysis = _load_latest_analysis(db)
    drills = recommendation_engine.generate(latest_analysis) if latest_analysis else []
    return TrainingTodayResponse(drills=drills)


@router.post("/complete", response_model=TrainingCompleteResponse)
def complete_training(payload: TrainingCompleteRequest, db: Session = Depends(get_db)):
    existing = (
        db.query(TrainingCompletion)
        .filter(TrainingCompletion.training_id == payload.trainingId)
        .first()
    )

    if existing:
        existing.completed_at = datetime.now(timezone.utc)
    else:
        db.add(
            TrainingCompletion(
                training_id=payload.trainingId,
                completed_at=datetime.now(timezone.utc),
            )
        )

    db.commit()
    return TrainingCompleteResponse(success=True)