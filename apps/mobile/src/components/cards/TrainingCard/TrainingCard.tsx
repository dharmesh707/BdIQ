import { Text, View, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  title: string;
  duration: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  reason?: string;
}

export default function TrainingCard({
  title,
  duration,
  difficulty,
  reason,
}: Props) {
  return (
    <Card>
      <Text style={styles.label}>TODAY'S TRAINING</Text>

      <Text style={styles.title}>{title}</Text>

      {reason ? <Text style={styles.reason}>{reason}</Text> : null}

      {difficulty ? <Text style={styles.difficulty}>{difficulty}</Text> : null}

      <Text style={styles.time}>{duration}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#777",
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: "700",
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },

  reason: {
    color: Theme.colors.textSecondary,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },

  difficulty: {
    color: Theme.colors.accent,
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
  },

  time: {
    color: Theme.colors.primary,
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
  },
});
