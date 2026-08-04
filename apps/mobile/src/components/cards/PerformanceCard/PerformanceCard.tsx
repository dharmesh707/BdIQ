import { View, Text, StyleSheet } from "react-native";

import ProgressRing from "../../ui/ProgressRing/ProgressRing";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  score: number;
  shot: string;
}

export default function PerformanceCard({ score, shot }: Props) {
  return (
    <Card>
      <Text style={styles.small}>DAILY PERFORMANCE</Text>

      <View style={{ marginTop: 25, alignItems: "center" }}>
        <ProgressRing progress={score} />
      </View>

      <Text style={styles.level}>
        {score >= 90
          ? "Elite"
          : score >= 80
            ? "Advanced"
            : score >= 70
              ? "Intermediate"
              : score >= 60
                ? "Beginner"
                : "Learning"}
      </Text>

      <Text style={styles.level}>Intermediate</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  small: {
    color: "#777",
    fontWeight: "700",
    letterSpacing: 1.4,
    fontSize: 12,
  },

  shot: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },

  level: {
    marginTop: 8,
    fontSize: 15,
    color: Theme.colors.primary,
    textAlign: "center",
  },
});
