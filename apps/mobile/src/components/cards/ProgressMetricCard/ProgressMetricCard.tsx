import { StyleSheet, Text } from "react-native";

import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

interface Props {
  title: string;

  value: number;
}

export default function ProgressMetricCard({ title, value }: Props) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{Math.round(value)}%</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Theme.colors.textSecondary,
    fontWeight: "700",
    fontSize: 13,
  },

  value: {
    marginTop: 10,
    color: Theme.colors.primary,
    fontWeight: "800",
    fontSize: 30,
  },
});
