"""
GET /dashboard  — Dashboard screen data
GET /progress   — Progress screen data
GET /history    — Real analysis history from DB
"""

from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Analysis, TrainingCompletion
from app.schemas.schemas import (
    DashboardResponse,
    ProgressResponse,
    RecentSession,
    SkillBreakdown,
)

router = APIRouter(tags=["dashboard"])


def _analysis_score(analysis: Analysis) -> float:
    return float(analysis.overall_score or 0)


def _analysis_date(analysis: Analysis) -> date | None:
    if not analysis.created_at:
        return None
    return analysis.created_at.date()


def _average(values: list[float]) -> float:
    if not values:
        return 0.0
    return round(sum(values) / len(values), 1)


def _clamp(value: float, minimum: float = 0.0, maximum: float = 100.0) -> float:
    return round(max(minimum, min(maximum, value)), 1)


def _metric_value(result_json: dict | None, metric_name: str) -> float | None:
    if not result_json:
        return None

    metrics = result_json.get("metrics")
    if not isinstance(metrics, dict):
        return None

    value = metrics.get(metric_name)
    if isinstance(value, (int, float)):
        return float(value)
    return None


def _build_skill_breakdown(analyses: list[Analysis]) -> SkillBreakdown:
    return SkillBreakdown(
        smash=_average(
            [
                value
                for analysis in analyses
                if (value := _metric_value(analysis.result_json, "smashPower"))
                is not None
            ]
        ),
        drive=_average(
            [
                value
                for analysis in analyses
                if (value := _metric_value(analysis.result_json, "timing")) is not None
            ]
        ),
        drop=_average(
            [
                value
                for analysis in analyses
                if (value := _metric_value(analysis.result_json, "balance")) is not None
            ]
        ),
        netPlay=_average(
            [
                value
                for analysis in analyses
                if (value := _metric_value(analysis.result_json, "recovery")) is not None
            ]
        ),
        footwork=_average(
            [
                value
                for analysis in analyses
                if (value := _metric_value(analysis.result_json, "footwork")) is not None
            ]
        ),
    )


def _build_recent_sessions(analyses: list[Analysis]) -> list[RecentSession]:
    sessions: list[RecentSession] = []
    for analysis in analyses[:5]:
        sessions.append(
            RecentSession(
                shotType=analysis.shot_type or "Unknown",
                score=_analysis_score(analysis),
                date=analysis.created_at.strftime("%d %b") if analysis.created_at else "Recent",
            )
        )
    return sessions


def _build_streak(analyses: list[Analysis]) -> int:
    active_days = {
        analysis_day
        for analysis in analyses
        if (analysis_day := _analysis_date(analysis)) is not None
    }

    if not active_days:
        return 0

    streak = 0
    current_day = max(active_days)

    while current_day in active_days:
        streak += 1
        current_day -= timedelta(days=1)

    return streak


def _build_weekly_progress(analyses: list[Analysis]) -> float:
    if len(analyses) < 10:
        return 0.0

    latest_window = analyses[:5]
    previous_window = analyses[5:10]

    latest_scores = [_analysis_score(analysis) for analysis in latest_window]
    previous_scores = [_analysis_score(analysis) for analysis in previous_window]

    if not latest_scores or not previous_scores:
        return 0.0

    return round(_average(latest_scores) - _average(previous_scores), 1)


def _build_coach_insight(analysis: Analysis | None) -> str:
    if not analysis:
        return "Upload another stroke to receive more coaching feedback."

    result_json = analysis.result_json or {}
    metrics = result_json.get("metrics")

    if not isinstance(metrics, dict) or not metrics:
        return "Upload another stroke to receive more coaching feedback."

    numeric_metrics = {
        key: float(value)
        for key, value in metrics.items()
        if isinstance(value, (int, float))
    }

    if not numeric_metrics:
        return "Upload another stroke to receive more coaching feedback."

    lowest_metric = min(numeric_metrics, key=numeric_metrics.get)

    messages = {
        "smashPower": "Smash power is your weakest area right now. Work on a cleaner contact point and faster racket acceleration.",
        "footwork": "Footwork is your weakest area right now. Focus on split steps, quicker recovery, and efficient movement patterns.",
        "timing": "Timing is your weakest area right now. Try to contact the shuttle earlier and stay balanced through the shot.",
        "balance": "Balance is your weakest area right now. Keep your base stable through contact and recovery.",
        "recovery": "Recovery is your weakest area right now. Reset faster after each shot so you are ready for the next rally ball.",
    }

    return messages.get(
        lowest_metric,
        f"{lowest_metric} is your weakest area right now. Focus on improving it in your next session.",
    )


def _metric_average(analyses: list[Analysis], metric_name: str) -> float | None:
    values = [
        value
        for analysis in analyses
        if (value := _metric_value(analysis.result_json, metric_name)) is not None
    ]
    if not values:
        return None
    return _average(values)


def _completed_training_count(db: Session) -> int:
    return int(db.query(func.count(TrainingCompletion.training_id)).scalar() or 0)


def _build_progress_values(analyses: list[Analysis], completion_count: int) -> ProgressResponse:
    latest_window = analyses[:5]
    completion_bonus = min(completion_count * 1.5, 15.0)

    def baseline(metric: float | None) -> float:
        if metric is None:
            return 50.0 + completion_bonus
        return metric + completion_bonus

    smash_base = _metric_average(latest_window, "smashPower")
    footwork_base = _metric_average(latest_window, "footwork")
    timing_base = _metric_average(latest_window, "timing")
    balance_base = _metric_average(latest_window, "balance")
    recovery_base = _metric_average(latest_window, "recovery")
    overall_base = _average([_analysis_score(a) for a in latest_window]) if latest_window else None

    consistency_source = overall_base if overall_base is not None else 50.0
    consistency = _clamp(consistency_source + min(completion_count * 2.0, 12.0))

    return ProgressResponse(
        smash=_clamp(baseline(smash_base)),
        drop=_clamp(baseline(balance_base)),
        drive=_clamp(baseline(timing_base)),
        clear=_clamp(baseline(recovery_base)),
        footwork=_clamp(baseline(footwork_base)),
        timing=_clamp(baseline(timing_base)),
        consistency=consistency,
        lastUpdated=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).order_by(desc(Analysis.created_at)).all()

    return DashboardResponse(
        overallScore=round(
            float(db.query(func.avg(Analysis.overall_score)).scalar() or 0),
            1,
        ),
        weeklyProgress=_build_weekly_progress(analyses),
        streak=_build_streak(analyses),
        skillBreakdown=_build_skill_breakdown(analyses),
        recentSessions=_build_recent_sessions(analyses),
        coachInsight=_build_coach_insight(analyses[0] if analyses else None),
    )


@router.get("/progress", response_model=ProgressResponse)
def get_progress(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).order_by(desc(Analysis.created_at)).all()
    completion_count = _completed_training_count(db)

    if not analyses and completion_count == 0:
        return ProgressResponse(
            smash=50,
            drop=50,
            drive=50,
            clear=50,
            footwork=50,
            timing=50,
            consistency=50,
            lastUpdated=datetime.now(timezone.utc).isoformat(),
        )

    return _build_progress_values(analyses, completion_count)


@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    try:
        analyses = db.query(Analysis).order_by(desc(Analysis.created_at)).limit(10).all()
        return [
            {
                "analysisId": str(a.id),
                "shotType": a.shot_type or "Unknown",
                "score": a.overall_score or 0,
                "date": a.created_at.strftime("%d %b") if a.created_at else "Recent",
            }
            for a in analyses
        ]
    except Exception:
        # Analysis model may not exist yet — return empty list gracefully
        return []