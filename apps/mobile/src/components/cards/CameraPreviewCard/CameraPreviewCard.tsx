import { View, Text, StyleSheet } from "react-native";

import Card from "../../ui/Card/Card";

import { Camera } from "lucide-react-native";

import { Theme } from "../../../theme";

export default function CameraPreviewCard() {
  return (
    <Card>
      <View style={styles.preview}>
        <Camera size={70} color={Theme.colors.primary} />

        <Text style={styles.text}>Camera Preview</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  preview: {
    height: 250,
    borderRadius: 18,
    backgroundColor: "#0E0E0E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#262626",
  },

  text: {
    marginTop: 20,
    color: "#777",
    fontSize: 16,
  },
});
