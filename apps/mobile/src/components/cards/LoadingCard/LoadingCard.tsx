import { ActivityIndicator, StyleSheet, Text } from "react-native";
import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

export default function LoadingCard() {
  return (
    <Card>
      <ActivityIndicator size="large" color={Theme.colors.primary} />

      <Text style={styles.text}>Loading...</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 16,
    textAlign: "center",
    color: Theme.colors.textSecondary,
  },
});
