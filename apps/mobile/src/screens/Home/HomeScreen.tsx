import { RefreshControl } from "react-native";
import { ScrollView } from "react-native";
import { Camera, BrainCircuit, Play } from "lucide-react-native";

import Screen from "../../components/layout/Screen";
import Header from "../../components/layout/Header";
import SectionTitle from "../../components/ui/SectionTitle/SectionTitle";

import PerformanceCard from "../../components/cards/PerformanceCard/PerformanceCard";
import ProgressCard from "../../components/cards/ProgressCard/ProgressCard";
import SkillBreakdownCard from "../../components/cards/SkillBreakdownCard/SkillBreakdownCard";
import CoachCard from "../../components/cards/CoachCard/CoachCard";
import SessionCard from "../../components/cards/SessionCard/SessionCard";
import TrainingCard from "../../components/cards/TrainingCard/TrainingCard";
import ActionCard from "../../components/cards/ActionCard/ActionCard";
import LoadingCard from "../../components/cards/LoadingCard/LoadingCard";
import ErrorCard from "../../components/cards/ErrorCard/ErrorCard";

import { useDashboard } from "../../hooks/useDashboard";
import { useHistory } from "../../hooks/useHistory";
import { useTodayTraining } from "../../hooks/useTraining";

import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const dashboard = useDashboard();
  const history = useHistory();
  const training = useTodayTraining();

  const loading =
    dashboard.isPending || history.isPending || training.isPending;

  const error = dashboard.error || history.error || training.error;

  async function refresh() {
    await Promise.all([
      dashboard.refetch(),
      history.refetch(),
      training.refetch(),
    ]);
  }

  if (loading) {
    return (
      <Screen>
        <Header title="BadmintonIQ" subtitle="Loading dashboard..." />

        <LoadingCard />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Header title="BadmintonIQ" subtitle="Unable to load dashboard." />

        <ErrorCard message="Something went wrong while loading your dashboard." />
      </Screen>
    );
  }

  const dashboardData = dashboard.data!;
  const historyData = history.data!;
  const drills = training.data?.drills ?? [];

  const todayDrill = drills.length > 0 ? drills[0] : null;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
      >
        <Header
          title="Welcome Back"
          subtitle="Ready to improve your badminton today?"
        />

        <PerformanceCard
          score={dashboardData.overallScore}
          shot={
            historyData.length > 0 ? historyData[0].shotType : "No Analysis Yet"
          }
        />

        <ProgressCard value={dashboardData.weeklyProgress} />

        <SectionTitle title="Today's AI Training" />

        {todayDrill ? (
          <TrainingCard
            title={todayDrill.title}
            duration={todayDrill.duration}
            difficulty={todayDrill.difficulty}
            reason={todayDrill.reason}
          />
        ) : (
          <CoachCard advice="Analyze a stroke to receive today's personalized training." />
        )}

        <SectionTitle title="Skill Breakdown" />

        <SkillBreakdownCard
          smash={dashboardData.skillBreakdown.smash}
          drive={dashboardData.skillBreakdown.drive}
          drop={dashboardData.skillBreakdown.drop}
          netPlay={dashboardData.skillBreakdown.netPlay}
          footwork={dashboardData.skillBreakdown.footwork}
        />
        <SectionTitle title="Quick Actions" />

        <ActionCard
          title="Analyze Stroke"
          subtitle="Upload or record a badminton stroke"
          buttonText="Analyze"
          icon={<Camera size={24} color="#FFF" />}
          onPress={() => navigation.navigate("Analyze")}
        />

        <ActionCard
          title="Start AI Training"
          subtitle="Today's personalized drills"
          buttonText="Train"
          icon={<Play size={24} color="#FFF" />}
          onPress={() => navigation.navigate("Training")}
        />

        <SectionTitle title="AI Coach Insight" />

        <CoachCard advice={dashboardData.coachInsight} />

        <SectionTitle title="Recent Analyses" />

        {historyData.length === 0 ? (
          <CoachCard advice="No analysis available yet. Upload your first badminton stroke to begin tracking your progress." />
        ) : (
          historyData.map((session) => (
            <SessionCard
              key={session.analysisId}
              shot={session.shotType}
              score={session.score}
              date={session.date}
            />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
