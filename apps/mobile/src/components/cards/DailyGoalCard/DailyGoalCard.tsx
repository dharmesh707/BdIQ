import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

export default function DailyGoalCard() {
  return (
    <Card>
      <Text style={styles.label}>TODAY'S GOAL</Text>

      <Text style={styles.goal}>Complete 3 AI analyses</Text>

      <Text style={styles.subtitle}>1 of 3 completed</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#777",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  goal: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: "700",
    color: "white",
  },

  subtitle: {
    marginTop: 8,
    color: Theme.colors.primary,
  },
});
