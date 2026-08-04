import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

interface Props {
  completed: number;
  total: number;
}

export default function TrainingSummaryCard({ completed, total }: Props) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card>
      <Text style={styles.title}>Training Summary</Text>

      <View style={styles.row}>
        <View>
          <Text style={styles.big}>{completed}</Text>

          <Text style={styles.small}>Completed</Text>
        </View>

        <View>
          <Text style={styles.big}>{total}</Text>

          <Text style={styles.small}>Recommended</Text>
        </View>

        <View>
          <Text style={styles.big}>{percentage}%</Text>

          <Text style={styles.small}>Completion</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Theme.colors.text,
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  big: {
    fontSize: 30,
    fontWeight: "800",
    color: Theme.colors.primary,
    textAlign: "center",
  },

  small: {
    marginTop: 6,
    color: Theme.colors.textSecondary,
    textAlign: "center",
    fontSize: 13,
  },
});
