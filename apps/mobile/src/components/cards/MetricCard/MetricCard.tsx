import { View, Text, StyleSheet } from "react-native";
import { Theme } from "../../../theme";

interface Props {
  title: string;
  value: number;
  color?: string;
}

export default function MetricCard({
  title,
  value,
  color = Theme.colors.primary,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text
        style={[
          styles.value,
          {
            color,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    width: "48%",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  title: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 18,
  },

  value: {
    fontSize: 34,
    fontWeight: "800",
  },
});
