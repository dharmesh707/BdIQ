"""
POST /analyze
Runs the real ML pipeline on an uploaded video.
Persists result to DB. Returns 422 with clear message if video is invalid.
Requires authentication — result is tied to the logged-in user.
"""

import os
from fastapi import APIRouter, HTTPException, Form, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.schemas import AnalysisResponse
from app.ml.pipeline import run_analysis_pipeline, mock_analysis_response
from app.db.database import get_db
from app.models.models import Analysis, User
from app.core.deps import get_current_user
router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=AnalysisResponse)
async def analyze_video(
    video_id: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Find the uploaded video file
    video_path = None
    for ext in [".mp4", ".mov", ".avi", ".mpeg", ".MP4", ".MOV"]:
        candidate = os.path.join(settings.UPLOAD_DIR, f"{video_id}{ext}")
        if os.path.exists(candidate):
            video_path = candidate
            break

    if not video_path:
        raise HTTPException(
            status_code=404,
            detail=f"Video not found for video_id: {video_id}. Upload first via POST /upload."
        )

    try:
        result = run_analysis_pipeline(video_path)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed due to a server error: {str(e)}"
        )

    # Persist to DB so GET /history returns real data
    analysis = Analysis(
        id=result.analysisId,
        user_id=current_user.id,
        video_path=video_path,
        shot_type=result.shotType,
        overall_score=result.overallScore,
        result_json=result.model_dump(),
    )
    db.add(analysis)
    db.commit()

    return result


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve a previously stored analysis by ID — only if it belongs to the current user."""
    analysis = (
        db.query(Analysis)
        .filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id)
        .first()
    )
    if analysis and analysis.result_json:
        return AnalysisResponse(**analysis.result_json)

    raise HTTPException(
        status_code=404,
        detail=f"Analysis {analysis_id} not found."
    )