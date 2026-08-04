import { Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

export default function StreakCard() {
  return (
    <Card>
      <Text style={styles.fire}>7 DAY STREAK</Text>

      <Text style={styles.title}>
        Keep practicing every day to improve your consistency.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  fire: {
    fontSize: 13,
    color: "#72F2B0",
    fontWeight: "700",
  },

  title: {
    marginTop: 14,
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
  },
});
