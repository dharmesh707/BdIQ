import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Theme } from "../../../theme";

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  progress,
  size = 170,
  strokeWidth = 14,
}: Props) {
  const radius = (size - strokeWidth) / 2;

  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (progress / 100) * circumference;

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          stroke="#262626"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <Circle
          stroke={Theme.colors.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.center}>
        <Text style={styles.value}>{progress}%</Text>

        <Text style={styles.label}>Accuracy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: "absolute",
    alignItems: "center",
  },

  value: {
    color: "white",
    fontSize: 38,
    fontWeight: "800",
  },

  label: {
    color: "#888",
    marginTop: 4,
    fontSize: 14,
  },
});
