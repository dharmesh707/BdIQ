import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";
import ProgressRing from "../../ui/ProgressRing/ProgressRing";

import { Theme } from "../../../theme";

interface Props {
  score: number;
}

export default function AnalysisScoreCard({ score }: Props) {
  return (
    <Card>
      <Text style={styles.small}>OVERALL TECHNIQUE SCORE</Text>

      <View style={styles.center}>
        <ProgressRing progress={score} />
      </View>

      <Text style={styles.score}>{Math.round(score)}%</Text>

      <Text style={styles.subtitle}>AI Technique Evaluation</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  small: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  center: {
    alignItems: "center",
    marginVertical: 25,
  },

  score: {
    color: Theme.colors.text,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 8,
    color: Theme.colors.primary,
    textAlign: "center",
    fontSize: 15,
  },
});
