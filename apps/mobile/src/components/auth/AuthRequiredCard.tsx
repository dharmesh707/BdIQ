import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; //here is the error

import { RootStackParamList } from "../../navigation/RootStack";
import { Theme } from "../../theme";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  title: string;
  description: string;
}

export default function AuthRequiredCard({ title, description }: Props) {
  const navigation = useNavigation<Navigation>();

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>🏸</Text>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.primaryText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.secondaryText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: "center",
  },

  emoji: {
    fontSize: 42,
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Theme.colors.text,
    textAlign: "center",
  },

  description: {
    marginTop: 12,
    textAlign: "center",
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },

  primaryButton: {
    marginTop: 24,
    width: "100%",
    backgroundColor: Theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },

  secondaryButton: {
    marginTop: 12,
    width: "100%",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  secondaryText: {
    color: Theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
});
