import Screen from "../../components/layout/Screen";
import Header from "../../components/layout/Header";
import SectionTitle from "../../components/ui/SectionTitle/SectionTitle";

import ProgressHeroCard from "../../components/cards/ProgressHeroCard/ProgressHeroCard";
import WeeklyTrendCard from "../../components/cards/WeeklyTrendCard/WeeklyTrendCard";
import TrainingSummaryCard from "../../components/cards/TrainingSummaryCard/TrainingSummaryCard";
import LastUpdatedCard from "../../components/cards/LastUpdatedCard/LastUpdatedCard";
import SkillBreakdownCard from "../../components/cards/SkillBreakdownCard/SkillBreakdownCard";
import CoachCard from "../../components/cards/CoachCard/CoachCard";
import AchievementCard from "../../components/cards/AchievementCard/AchievementCard";
import LoadingCard from "../../components/cards/LoadingCard/LoadingCard";
import ErrorCard from "../../components/cards/ErrorCard/ErrorCard";

import { useDashboard, useProgress } from "../../hooks/useDashboard";
import { useTodayTraining } from "../../hooks/useTraining";

export default function ProgressScreen() {
  const dashboard = useDashboard();
  const progress = useProgress();
  const training = useTodayTraining();

  if (dashboard.isPending || progress.isPending || training.isPending) {
    return (
      <Screen>
        <Header title="Progress" subtitle="Loading your analytics..." />

        <LoadingCard />
      </Screen>
    );
  }

  if (dashboard.error || progress.error || training.error) {
    return (
      <Screen>
        <Header title="Progress" subtitle="Unable to load analytics." />

        <ErrorCard message="Failed to load progress data." />
      </Screen>
    );
  }

  const dashboardData = dashboard.data!;
  const progressData = progress.data!;
  const drills = training.data?.drills ?? [];

  const completed = drills.filter((d) => d.completed).length;

  return (
    <Screen>
      <Header
        title="Progress"
        subtitle="Your badminton performance analytics."
      />

      <ProgressHeroCard
        score={dashboardData.overallScore}
        consistency={progressData.consistency}
        weeklyProgress={dashboardData.weeklyProgress}
      />

      <SectionTitle title="Skill Analytics" />

      <WeeklyTrendCard
        smash={progressData.smash}
        drive={progressData.drive}
        drop={progressData.drop}
        clear={progressData.clear}
        footwork={progressData.footwork}
        timing={progressData.timing}
      />

      <SectionTitle title="Overall Skills" />

      <SkillBreakdownCard
        smash={dashboardData.skillBreakdown.smash}
        drive={dashboardData.skillBreakdown.drive}
        drop={dashboardData.skillBreakdown.drop}
        netPlay={dashboardData.skillBreakdown.netPlay}
        footwork={dashboardData.skillBreakdown.footwork}
      />

      <SectionTitle title="Training Summary" />

      <TrainingSummaryCard completed={completed} total={drills.length} />

      <SectionTitle title="Achievements" />

      <AchievementCard
        achievement={
          dashboardData.streak >= 7
            ? "7 Day Training Streak"
            : dashboardData.overallScore >= 90
              ? "Elite Performance"
              : dashboardData.overallScore >= 80
                ? "Advanced Player"
                : "Keep Improving"
        }
      />

      <SectionTitle title="AI Coach" />

      <CoachCard advice={dashboardData.coachInsight} />

      <LastUpdatedCard date={progressData.lastUpdated} />
    </Screen>
  );
}
