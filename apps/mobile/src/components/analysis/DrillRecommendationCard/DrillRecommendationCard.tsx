import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

interface Drill {
  title: string;
  duration: string;
  difficulty: string;
}

interface Props {
  drills: Drill[];
}

export default function DrillRecommendationCard({ drills }: Props) {
  return (
    <Card>
      <Text style={styles.title}>Recommended Drills</Text>

      {drills.map((drill, index) => (
        <View key={index} style={styles.drill}>
          <Text style={styles.name}>{drill.title}</Text>

          <Text style={styles.meta}>
            {drill.duration} • {drill.difficulty}
          </Text>
        </View>
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

  drill: {
    marginBottom: 18,
  },

  name: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  meta: {
    color: Theme.colors.textSecondary,
    marginTop: 5,
  },
});
