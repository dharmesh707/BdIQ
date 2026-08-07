"""
Training recommendation engine.

The engine is intentionally isolated behind a single class so it can be
replaced later with an ML-backed recommender without changing the API layer.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

from app.schemas.schemas import AnalysisResponse, TrainingDrill


@dataclass(frozen=True)
class DrillTemplate:
    title: str
    description: str
    duration: str
    difficulty: str
    target_metric: str
    expected_improvement: str
    base_reason: str


class RecommendationEngine:
    """Heuristic recommendation engine for badminton training drills."""

    metric_templates: dict[str, DrillTemplate] = {
        "smashPower": DrillTemplate(
            title="Explosive Smash Contact Drill",
            description=(
                "Feed shuttles to the rear court and focus on a full arm extension, "
                "fast racket acceleration, and a clean contact point above the shoulder."
            ),
            duration="12 min",
            difficulty="Medium",
            target_metric="smashPower",
            expected_improvement="Stronger smash penetration and cleaner power transfer.",
            base_reason="Your smash power is one of the lowest areas in the latest analysis.",
        ),
        "footwork": DrillTemplate(
            title="Split-Step Recovery Circuit",
            description=(
                "Perform corner-to-center movement patterns with a split step on every feed "
                "and recover to the base position before the next shuttle arrives."
            ),
            duration="10 min",
            difficulty="Easy",
            target_metric="footwork",
            expected_improvement="Quicker first step and more efficient court coverage.",
            base_reason="Your footwork score suggests movement speed and recovery should be a focus.",
        ),
        "timing": DrillTemplate(
            title="Contact Timing Rhythm Drill",
            description=(
                "Use controlled feeds and count-based rhythm cues to meet the shuttle at the "
                "peak contact point instead of reaching late or striking off-balance."
            ),
            duration="11 min",
            difficulty="Medium",
            target_metric="timing",
            expected_improvement="Earlier contact and better shot preparation under pressure.",
            base_reason="Your timing score suggests the contact moment can be more consistent.",
        ),
        "balance": DrillTemplate(
            title="Single-Leg Landing Stability Drill",
            description=(
                "Move into each shot, land in control, and freeze your finishing position for a "
                "brief count to reinforce posture and balance through the stroke."
            ),
            duration="9 min",
            difficulty="Easy",
            target_metric="balance",
            expected_improvement="Cleaner body control and fewer off-balance recoveries.",
            base_reason="Your balance score shows you can be more stable through contact and landing.",
        ),
        "recovery": DrillTemplate(
            title="Recovery Shadow Pattern Drill",
            description=(
                "Shadow each attack shot and immediately recover to the ready stance, focusing on "
                "efficient reset steps and a fast return to the center of the court."
            ),
            duration="8 min",
            difficulty="Easy",
            target_metric="recovery",
            expected_improvement="Faster reset speed and better readiness for the next rally ball.",
            base_reason="Your recovery score shows room to improve how quickly you reset after each shot.",
        ),
    }

    metric_order = ["smashPower", "footwork", "timing", "balance", "recovery"]

    def generate(self, analysis: AnalysisResponse) -> list[TrainingDrill]:
        prioritized_metrics = self._prioritized_metrics(analysis)
        drill_count = self._drill_count(analysis)

        drills: list[TrainingDrill] = []
        for index, metric_name in enumerate(prioritized_metrics[:drill_count], start=1):
            template = self.metric_templates[metric_name]
            drills.append(self._build_drill(analysis, template, index))

        return drills

    def _drill_count(self, analysis: AnalysisResponse) -> int:
        score = float(analysis.overallScore)
        if score >= 85:
            return 1
        if score >= 65:
            return 2
        return 3

    def _prioritized_metrics(self, analysis: AnalysisResponse) -> list[str]:
        metrics = {
            "smashPower": float(analysis.metrics.smashPower),
            "footwork": float(analysis.metrics.footwork),
            "timing": float(analysis.metrics.timing),
            "balance": float(analysis.metrics.balance),
            "recovery": float(analysis.metrics.recovery),
        }

        mistake_hits = self._text_hits(analysis.mistakes, metrics.keys())
        strength_hits = self._text_hits(analysis.strengths, metrics.keys())

        scored_metrics = []
        for metric_name, metric_score in metrics.items():
            adjusted_score = metric_score
            if metric_name in mistake_hits:
                adjusted_score -= 7
            if metric_name in strength_hits:
                adjusted_score += 3
            scored_metrics.append((adjusted_score, metric_name))

        scored_metrics.sort(key=lambda item: item[0])
        return [metric_name for _, metric_name in scored_metrics]

    def _build_drill(
        self,
        analysis: AnalysisResponse,
        template: DrillTemplate,
        sequence_number: int,
    ) -> TrainingDrill:
        metric_value = self._metric_value(analysis, template.target_metric)
        angle_hint = self._angle_hint(analysis, template.target_metric)
        mistake_hint = self._best_match(analysis.mistakes, template.target_metric)
        strength_hint = self._best_match(analysis.strengths, template.target_metric)

        reason_parts = [template.base_reason]
        if mistake_hint:
            reason_parts.append(f"Your latest mistakes mention {mistake_hint}.")
        if strength_hint:
            reason_parts.append(f"You can lean on your {strength_hint} strength while fixing this.")
        if angle_hint:
            reason_parts.append(angle_hint)

        if metric_value is not None:
            reason_parts.append(
                f"Current {template.target_metric} score: {metric_value:.1f}."
            )

        drill_id = f"{analysis.analysisId}-{template.target_metric}-{sequence_number}"

        return TrainingDrill(
            id=drill_id,
            title=template.title,
            description=template.description,
            duration=template.duration,
            difficulty=template.difficulty,  # type: ignore[arg-type]
            targetMetric=template.target_metric,
            expectedImprovement=template.expected_improvement,
            reason=" ".join(reason_parts),
            completed=False,
        )

    def _metric_value(self, analysis: AnalysisResponse, metric_name: str) -> float | None:
        value = getattr(analysis.metrics, metric_name, None)
        if isinstance(value, (int, float)):
            return float(value)
        return None

    def _text_hits(
        self,
        items: Iterable[str],
        metric_names: Iterable[str],
    ) -> set[str]:
        lowered_items = [item.lower() for item in items]
        hits: set[str] = set()
        for metric_name in metric_names:
            needle = metric_name.lower()
            short_name = needle.replace("power", "").replace("foot", "foot")
            for text in lowered_items:
                if needle in text or short_name in text:
                    hits.add(metric_name)
                    break
        return hits

    def _best_match(self, items: Iterable[str], metric_name: str) -> str | None:
        metric_keywords = {
            "smashPower": ["smash", "power", "contact", "racket"],
            "footwork": ["footwork", "movement", "steps", "recovery"],
            "timing": ["timing", "late", "early", "contact"],
            "balance": ["balance", "stability", "posture", "landing"],
            "recovery": ["recovery", "reset", "return"],
        }

        keywords = metric_keywords.get(metric_name, [])
        for item in items:
            lowered = item.lower()
            if any(keyword in lowered for keyword in keywords):
                return item
        return None

    def _angle_hint(self, analysis: AnalysisResponse, metric_name: str) -> str | None:
        angles = analysis.jointAngles

        if metric_name == "smashPower":
            return (
                f"Your contact-side elbow angle is {angles.elbow:.0f}° and shoulder angle is "
                f"{angles.shoulder:.0f}°, so this drill reinforces cleaner extension and power transfer."
            )

        if metric_name == "footwork":
            return (
                f"Your knee angle is {angles.knee:.0f}° and hip angle is {angles.hip:.0f}°, which "
                f"can help tune your split-step base and movement control."
            )

        if metric_name == "timing":
            return (
                f"The contact angles show room to tighten your shot timing, especially with the "
                f"current elbow angle at {angles.elbow:.0f}°."
            )

        if metric_name == "balance":
            return (
                f"Your hip angle is {angles.hip:.0f}° and knee angle is {angles.knee:.0f}°, so this "
                f"drill keeps your landing position controlled through contact."
            )

        if metric_name == "recovery":
            return (
                f"Your lower-body angles suggest you can reset more cleanly after landing, especially "
                f"with the knee angle currently at {angles.knee:.0f}°."
            )

        return None


recommendation_engine = RecommendationEngine()