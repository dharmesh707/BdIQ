import { StyleSheet, Text } from "react-native";
import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

export default function SettingsCard() {
  return (
    <Card>
      <Text style={styles.item}>Dark Theme (Coming Soon)</Text>
      <Text style={styles.item}>Notifications (Coming Soon)</Text>
      <Text style={styles.item}>Export Reports (Coming Soon)</Text>
      <Text style={styles.item}>Logout (Coming Soon)</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  item: {
    color: Theme.colors.text,
    paddingVertical: 12,
    fontSize: 16,
  },
});
