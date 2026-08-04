import { StyleSheet, Text } from "react-native";
import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

export default function AboutCard() {
  return (
    <Card>
      <Text style={styles.title}>BadmintonIQ</Text>

      <Text style={styles.version}>Version 1.0.0</Text>

      <Text style={styles.body}>
        AI-powered badminton technique analysis using computer vision, pose
        estimation and personalized coaching recommendations.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Theme.colors.primary,
    fontWeight: "800",
    fontSize: 22,
  },

  version: {
    marginTop: 8,
    color: Theme.colors.textSecondary,
  },

  body: {
    marginTop: 16,
    color: Theme.colors.text,
    lineHeight: 24,
    fontSize: 15,
  },
});
