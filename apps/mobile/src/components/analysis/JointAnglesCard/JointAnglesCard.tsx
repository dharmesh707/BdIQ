import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  angles: {
    shoulder: number;
    elbow: number;
    hip: number;
    knee: number;
  };
}

function Row({ joint, value }: { joint: string; value: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.joint}>{joint}</Text>

      <Text style={styles.value}>{Math.round(value)}°</Text>
    </View>
  );
}

export default function JointAnglesCard({ angles }: Props) {
  return (
    <Card>
      <Text style={styles.title}>Joint Angles</Text>

      <Row joint="Shoulder" value={angles.shoulder} />

      <Row joint="Elbow" value={angles.elbow} />

      <Row joint="Hip" value={angles.hip} />

      <Row joint="Knee" value={angles.knee} />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Theme.colors.text,
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  joint: {
    color: Theme.colors.textSecondary,
    fontSize: 15,
  },

  value: {
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
});
