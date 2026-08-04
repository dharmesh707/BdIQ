import { View, StyleSheet } from "react-native";

import MetricCard from "../MetricCard/MetricCard";

export default function MetricsGrid() {
  return (
    <View>
      <View style={styles.row}>
        <MetricCard title="Overall Score" value={84} />

        <MetricCard title="Smash Power" value={91} />
      </View>

      <View style={styles.row}>
        <MetricCard title="Footwork" value={79} />

        <MetricCard title="Timing" value={88} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
