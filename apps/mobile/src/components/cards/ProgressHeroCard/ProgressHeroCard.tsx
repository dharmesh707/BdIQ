import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";
import ProgressRing from "../../ui/ProgressRing/ProgressRing";

import { Theme } from "../../../theme";

interface Props {
  score: number;
  consistency: number;
  weeklyProgress: number;
}

export default function ProgressHeroCard({
  score,
  consistency,
  weeklyProgress,
}: Props) {
  return (
    <Card>
      <Text style={styles.small}>PERFORMANCE OVERVIEW</Text>

      <View style={styles.center}>
        <ProgressRing progress={score} />
      </View>

      <Text style={styles.score}>{Math.round(score)}%</Text>

      <Text style={styles.level}>
        {score >= 90
          ? "Elite Player"
          : score >= 80
            ? "Advanced"
            : score >= 70
              ? "Intermediate"
              : "Beginner"}
      </Text>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.value}>{Math.round(consistency)}%</Text>

          <Text style={styles.label}>Consistency</Text>
        </View>

        <View>
          <Text style={styles.value}>
            {weeklyProgress > 0 ? "+" : ""}
            {weeklyProgress.toFixed(1)}%
          </Text>

          <Text style={styles.label}>Weekly Growth</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  small: {
    color: Theme.colors.textSecondary,
    fontWeight: "700",
    letterSpacing: 1.2,
    fontSize: 12,
  },

  center: {
    alignItems: "center",
    marginTop: 25,
  },

  score: {
    textAlign: "center",
    marginTop: 22,
    color: Theme.colors.text,
    fontSize: 34,
    fontWeight: "800",
  },

  level: {
    textAlign: "center",
    marginTop: 8,
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },

  bottomRow: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  value: {
    color: Theme.colors.text,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  label: {
    marginTop: 6,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
});
