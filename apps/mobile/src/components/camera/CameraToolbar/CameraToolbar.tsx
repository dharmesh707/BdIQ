import { View, StyleSheet } from "react-native";

import ActionButton from "../../cards/ActionButton/ActionButton";

interface Props {
  onRecord?: () => void;
  onUpload?: () => void;
}

export default function CameraToolbar({ onRecord, onUpload }: Props) {
  return (
    <View style={styles.container}>
      <ActionButton title="Record" onPress={onRecord} />

      <ActionButton
        title="Upload"
        backgroundColor="#1F1F1F"
        onPress={onUpload}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});
