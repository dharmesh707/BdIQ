import { View, Text, StyleSheet } from "react-native";

import { TrendingUp } from "lucide-react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  value: number;
}

export default function ProgressCard({ value }: Props) {
  return (
    <Card>
      <View style={styles.row}>
        <TrendingUp color={Theme.colors.primary} size={30} />

        <View style={{ marginLeft: 18 }}>
          <Text style={styles.value}>
            {value > 0 ? "+" : ""}
            {value.toFixed(1)}%
          </Text>

          <Text style={styles.subtitle}>Better than last week</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  value: {
    color: Theme.colors.primary,
    fontWeight: "800",
    fontSize: 28,
  },

  subtitle: {
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
});
