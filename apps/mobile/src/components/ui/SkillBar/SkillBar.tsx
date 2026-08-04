import { View, Text, StyleSheet } from "react-native";

import { Theme } from "../../../theme";

interface Props {
  skill: string;
  value: number;
}

export default function SkillBar({ skill, value }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.skill}>{skill}</Text>

        <Text style={styles.value}>{value}%</Text>
      </View>

      <View style={styles.background}>
        <View
          style={[
            styles.progress,
            {
              width: `${value}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  skill: {
    color: Theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  value: {
    color: Theme.colors.primary,
    fontWeight: "700",
  },

  background: {
    height: 10,
    backgroundColor: "#262626",
    borderRadius: 8,
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
  },
});
