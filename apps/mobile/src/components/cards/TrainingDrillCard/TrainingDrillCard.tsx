import { Pressable, StyleSheet, Text, View } from "react-native";

import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

interface Props {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  targetMetric: string;
  expectedImprovement: string;
  completed: boolean;
  onPress(): void;
}

export default function TrainingDrillCard({
  title,
  description,
  duration,
  difficulty,
  targetMetric,
  expectedImprovement,
  completed,
  onPress,
}: Props) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.row}>
        <Text style={styles.badge}>{duration}</Text>

        <Text style={styles.badge}>{difficulty}</Text>
      </View>

      <Text style={styles.metric}>Target: {targetMetric}</Text>

      <Text style={styles.improvement}>Expected: {expectedImprovement}</Text>

      <Pressable
        disabled={completed}
        onPress={onPress}
        style={[styles.button, completed && styles.completedButton]}
      >
        <Text style={styles.buttonText}>
          {completed ? "Completed" : "Mark Complete"}
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Theme.colors.text,
  },

  description: {
    marginTop: 10,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  badge: {
    color: Theme.colors.primary,
    fontWeight: "600",
  },

  metric: {
    marginTop: 15,
    color: Theme.colors.text,
    fontWeight: "600",
  },

  improvement: {
    marginTop: 8,
    color: Theme.colors.textSecondary,
  },

  button: {
    marginTop: 22,
    backgroundColor: Theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  completedButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
