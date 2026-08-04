import { View, Text, StyleSheet } from "react-native";

import { Theme } from "../../../theme";

interface Props {
  name: string;
  level: string;
}

export default function PlayerBanner({ name, level }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{name}</Text>

        <Text style={styles.level}>{level}</Text>
      </View>

      <View style={styles.avatar}>
        <Text style={styles.initial}>{name.charAt(0)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  name: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
  },

  level: {
    color: Theme.colors.primary,
    marginTop: 4,
    fontSize: 15,
  },

  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
  },

  initial: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
});
