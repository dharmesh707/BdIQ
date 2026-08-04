import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

const shots = [
  "Smash",
  "Drop",
  "Clear",
  "Drive",
  "Lift",
  "Push",
  "Net Kill",
  "Slice",
];

export default function SupportedShotsCard() {
  return (
    <Card>
      <Text style={styles.title}>Supported Shots</Text>

      <View style={styles.container}>
        {shots.map((shot) => (
          <View key={shot} style={styles.chip}>
            <Text style={styles.text}>{shot}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },

  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#1F1F1F",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 10,
  },

  text: {
    color: "white",
  },
});
