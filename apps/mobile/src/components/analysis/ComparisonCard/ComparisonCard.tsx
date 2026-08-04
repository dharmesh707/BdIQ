import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

interface Props {
  player: string;
  similarity: number;
}

export default function ComparisonCard({ player, similarity }: Props) {
  return (
    <Card>
      <Text style={styles.label}>PROFESSIONAL COMPARISON</Text>

      <Text style={styles.player}>{player}</Text>

      <Text style={styles.similarity}>{similarity.toFixed(1)}% Similar</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Theme.colors.textSecondary,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
  },

  player: {
    marginTop: 18,
    color: Theme.colors.text,
    fontSize: 26,
    fontWeight: "700",
  },

  similarity: {
    marginTop: 8,
    color: Theme.colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
});
