import { TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  onPress?: () => void;
}

export default function RecordButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.outer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <TouchableOpacity activeOpacity={1} style={styles.inner} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  inner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF3B30",
  },
});
