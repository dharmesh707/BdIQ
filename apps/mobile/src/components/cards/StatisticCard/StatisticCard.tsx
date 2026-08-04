import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  title: string;

  value: string | number;

  subtitle?: string;
}

export default function StatisticCard({ title, value, subtitle }: Props) {
  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },

  value: {
    marginTop: 10,
    color: Theme.colors.text,
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 8,
    color: Theme.colors.primary,
    fontSize: 14,
  },
});
