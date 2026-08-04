import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

interface Props {
  strengths: string[];
}

export default function StrengthCard({ strengths }: Props) {
  return (
    <Card>
      <Text style={styles.title}>Strengths</Text>

      {strengths.map((item, index) => (
        <Text key={index} style={styles.item}>
          • {item}
        </Text>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Theme.colors.text,
    marginBottom: 15,
  },

  item: {
    color: Theme.colors.textSecondary,
    marginBottom: 12,
    fontSize: 15,
    lineHeight: 24,
  },
});
