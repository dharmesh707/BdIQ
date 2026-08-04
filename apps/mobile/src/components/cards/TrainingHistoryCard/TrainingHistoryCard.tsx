import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  title: string;

  completed: boolean;
}

export default function TrainingHistoryCard({ title, completed }: Props) {
  return (
    <Card>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>

        <Text
          style={[
            styles.status,
            {
              color: completed ? "#3FB950" : "#FFB020",
            },
          ]}
        >
          {completed ? "Completed" : "Pending"}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  status: {
    fontWeight: "700",
  },
});
