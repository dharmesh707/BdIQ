import { Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

const styles = StyleSheet.create({
  text: {
    color: "#DDDDDD",
    lineHeight: 24,
    fontSize: 15,
  },
});

interface Props {
  advice?: string;
}

export default function CoachCard({ advice }: Props) {
  return (
    <Card>
      <Text style={styles.text}>
        {advice ?? "Upload another stroke to receive AI coaching feedback."}
      </Text>
    </Card>
  );
}
