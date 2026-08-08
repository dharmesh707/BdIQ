import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import { Theme } from "../../theme";

interface Props {
  title: string;
  buttonText: string;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function AuthForm({ title, buttonText, onSubmit }: Props) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) return;

    try {
      setLoading(true);

      await onSubmit(email.trim(), password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Theme.colors.textSecondary}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Theme.colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Please wait..." : buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Theme.colors.text,
    marginBottom: 10,
  },

  input: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },

  button: {
    backgroundColor: Theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
