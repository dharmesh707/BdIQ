import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

import { ChevronRight } from "lucide-react-native";

import { Theme } from "../../../theme";

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export default function PremiumActionCard({
  icon,
  title,
  subtitle,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{icon}</View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <ChevronRight size={18} color={Theme.colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    marginLeft: 16,
  },

  title: {
    color: Theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  subtitle: {
    color: Theme.colors.textSecondary,
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
});
