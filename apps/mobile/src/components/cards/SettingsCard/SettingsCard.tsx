import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { Theme } from "../../../theme";
import { useAuth } from "../../../hooks/useAuth";

export default function SettingsCard() {
  const { logout } = useAuth();

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 20,
    borderRadius: 18,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },

  button: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
