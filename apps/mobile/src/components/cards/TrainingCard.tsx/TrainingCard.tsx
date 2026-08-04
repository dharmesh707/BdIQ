import { View, Text, StyleSheet, Pressable } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  id: string;

  title: string;

  duration: string;

  difficulty: string;

  reason: string;

  targetMetric: string;

  onStart(): void;
}

export default function TrainingCard({
  title,
  duration,
  difficulty,
  reason,
  targetMetric,
  onStart,
}: Props) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.metric}>Target : {targetMetric}</Text>

      <Text style={styles.reason}>{reason}</Text>

      <View style={styles.row}>
        <Text style={styles.info}>{duration}</Text>

        <Text style={styles.info}>{difficulty}</Text>
      </View>

      <Pressable style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>Start Training</Text>
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

  metric: {
    marginTop: 8,
    color: Theme.colors.primary,
    fontWeight: "600",
  },

  reason: {
    marginTop: 10,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },

  row: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  info: {
    color: Theme.colors.text,
    fontWeight: "600",
  },

  button: {
    marginTop: 20,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
