import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { Theme } from "../../../theme";

interface Props {
  title: string;
  backgroundColor?: string;
  onPress?: () => void;
}

export default function ActionButton({
  title,
  backgroundColor = Theme.colors.primary,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  text: {
    color: "#050505",
    fontSize: 17,
    fontWeight: "700",
  },
});
