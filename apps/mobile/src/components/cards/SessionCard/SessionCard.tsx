import { View, Text, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";

import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

interface Props {
  shot: string;
  score: number;
  date: string;
}

export default function SessionCard({ shot, score, date }: Props) {
  return (
    <Card>
      <View style={styles.row}>
        <View>
          <Text style={styles.shot}>{shot}</Text>

          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.score}>{Math.round(score)}%</Text>
          <ChevronRight size={18} color={Theme.colors.textSecondary} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  shot: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  date: {
    marginTop: 6,
    color: Theme.colors.textSecondary,
    fontSize: 14,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  score: {
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 20,
    marginRight: 8,
  },
});
