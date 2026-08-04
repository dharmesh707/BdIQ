import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  smash: number;
  drive: number;
  drop: number;
  clear: number;
  footwork: number;
  timing: number;
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.barContainer}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>

        <Text style={styles.percent}>{Math.round(value)}%</Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${value}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function WeeklyTrendCard(props: Props) {
  return (
    <Card>
      <Text style={styles.title}>Skill Performance</Text>

      <Bar label="Smash" value={props.smash} />

      <Bar label="Drive" value={props.drive} />

      <Bar label="Drop" value={props.drop} />

      <Bar label="Clear" value={props.clear} />

      <Bar label="Footwork" value={props.footwork} />

      <Bar label="Timing" value={props.timing} />
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

  barContainer: {
    marginBottom: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    color: Theme.colors.text,
    fontWeight: "600",
  },

  percent: {
    color: Theme.colors.primary,
    fontWeight: "700",
  },

  track: {
    height: 8,
    backgroundColor: Theme.colors.border,
    borderRadius: 6,
    overflow: "hidden",
  },

  fill: {
    height: 8,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
  },
});
