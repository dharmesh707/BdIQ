import { Alert } from "react-native";

import Screen from "../../components/layout/Screen";
import Header from "../../components/layout/Header";
import SectionTitle from "../../components/ui/SectionTitle/SectionTitle";

import TrainingDrillCard from "../../components/cards/TrainingDrillCard/TrainingDrillCard";

import { useCompleteTraining, useTodayTraining } from "../../hooks/useTraining";

import CoachCard from "../../components/cards/CoachCard/CoachCard";

export default function LearnScreen() {
  const { data, isPending, error, refetch } = useTodayTraining();

  const completeMutation = useCompleteTraining();

  async function completeDrill(id: string) {
    try {
      await completeMutation.mutateAsync(id);

      Alert.alert(
        "Training Completed",
        "Great work! Your progress has been updated.",
      );

      refetch();
    } catch {
      Alert.alert("Error", "Unable to update training.");
    }
  }

  if (isPending) {
    return (
      <Screen>
        <Header
          title="Today's Training"
          subtitle="Generating AI recommendations..."
        />

        <CoachCard advice="Loading training session..." />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Header title="Today's Training" subtitle="Unable to load drills." />

        <CoachCard advice="Please check your connection and try again." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Today's AI Training"
        subtitle="Personalized drills generated from your latest analysis."
      />

      <SectionTitle title="Recommended Drills" />

      {data?.drills.length === 0 ? (
        <CoachCard advice="Analyze a badminton stroke first to unlock personalized training." />
      ) : (
        data?.drills.map((drill) => (
          <TrainingDrillCard
            key={drill.id}
            title={drill.title}
            description={drill.description}
            duration={drill.duration}
            difficulty={drill.difficulty}
            targetMetric={drill.targetMetric}
            expectedImprovement={drill.expectedImprovement}
            completed={drill.completed}
            onPress={() => completeDrill(drill.id)}
          />
        ))
      )}
    </Screen>
  );
}
