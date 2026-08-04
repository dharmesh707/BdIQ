import { Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

interface Props {
  date: string;
}

export default function LastUpdatedCard({ date }: Props) {
  const formatted = new Date(date).toLocaleString();

  return (
    <Card>
      <Text style={styles.title}>Last Updated</Text>

      <Text style={styles.date}>{formatted}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Theme.colors.textSecondary,
    fontWeight: "700",
    fontSize: 14,
  },

  date: {
    marginTop: 12,
    color: Theme.colors.text,
    fontWeight: "700",
    fontSize: 18,
  },
});
