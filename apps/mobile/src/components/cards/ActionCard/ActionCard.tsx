import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { Theme } from "../../../theme";

interface Props {
  title: string;
  subtitle?: string;
  buttonText?: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

export default function ActionCard({
  title,
  subtitle,
  buttonText,
  icon,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {icon}

      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {buttonText ? <Text style={styles.buttonText}>{buttonText}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "31%",
    backgroundColor: Theme.colors.surface,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 22,
  },

  title: {
    color: Theme.colors.text,
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
  },

  subtitle: {
    color: Theme.colors.textSecondary,
    marginTop: 4,
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 8,
  },

  buttonText: {
    color: Theme.colors.primary,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
});
