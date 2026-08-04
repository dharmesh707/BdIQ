import { Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  achievement: string;
}

export default function AchievementCard({ achievement }: Props) {
  return (
    <Card>
      <Text style={styles.text}>🏆 {achievement}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
