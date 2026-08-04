import { StyleSheet, Text } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  title: string;

  value: string | number;
}

export default function ProfileStatisticCard({ title, value }: Props) {
  return (
    <Card>
      <Text style={styles.value}>{value}</Text>

      <Text style={styles.title}>{title}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  value: {
    color: Theme.colors.primary,
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  title: {
    marginTop: 10,
    textAlign: "center",
    color: Theme.colors.textSecondary,
  },
});
