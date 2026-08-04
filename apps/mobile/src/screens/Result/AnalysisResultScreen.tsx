import { ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../components/layout/Screen";
import Header from "../../components/layout/Header";

import AnalysisScoreCard from "../../components/analysis/AnalysisScoreCard/AnalysisScoreCard";
import ComparisonCard from "../../components/analysis/ComparisonCard/ComparisonCard";
import JointAnglesCard from "../../components/analysis/JointAnglesCard/JointAnglesCard";
import StrengthCard from "../../components/analysis/StrengthCard/StrengthCard";
import MistakeCard from "../../components/analysis/MistakeCard/MistakeCard";
import DrillRecommendationCard from "../../components/analysis/DrillRecommendationCard/DrillRecommendationCard";

import { RootStackParamList } from "../../navigation/RootStack";

type Props = NativeStackScreenProps<RootStackParamList, "Analysis">;

export default function AnalysisResultScreen({ route }: Props) {
  const { analysis } = route.params;

  return (
    <Screen>
      <Header title="AI Analysis" subtitle={analysis.shotType} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <AnalysisScoreCard score={analysis.overallScore} />

        <ComparisonCard
          player={analysis.professionalComparison.player}
          similarity={analysis.professionalComparison.similarity}
        />

        <JointAnglesCard angles={analysis.jointAngles} />

        <StrengthCard strengths={analysis.strengths} />

        <MistakeCard mistakes={analysis.mistakes} />

        <DrillRecommendationCard drills={analysis.recommendations} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({});
