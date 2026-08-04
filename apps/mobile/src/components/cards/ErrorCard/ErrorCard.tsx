import { StyleSheet, Text } from "react-native";
import Card from "../../ui/Card/Card";

interface Props {
  message: string;
}

export default function ErrorCard({ message }: Props) {
  return (
    <Card>
      <Text style={styles.text}>{message}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#ff6b6b",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
});
