import { StyleSheet, Text } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  score: number;

  consistency: number;
}

export default function PlayerLevelCard({ score, consistency }: Props) {
  return (
    <Card>
      <Text style={styles.score}>{Math.round(score)}%</Text>

      <Text style={styles.label}>Average Performance</Text>

      <Text style={styles.consistency}>
        Consistency {Math.round(consistency)}%
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  score: {
    color: Theme.colors.primary,
    fontWeight: "800",
    fontSize: 40,
    textAlign: "center",
  },

  label: {
    textAlign: "center",
    color: Theme.colors.textSecondary,
    marginTop: 8,
  },

  consistency: {
    marginTop: 16,
    textAlign: "center",
    color: Theme.colors.text,
    fontWeight: "700",
  },
});
