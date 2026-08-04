import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import Card from "../../ui/Card/Card";
import { Theme } from "../../../theme";

interface Props {
  shot: string;
  progress: number;
}

export default function FocusCard({ shot, progress }: Props) {
  return (
    <Card>
      <Text style={styles.label}>TODAY'S FOCUS</Text>

      <Text style={styles.title}>{shot}</Text>

      <Text style={styles.progress}>{progress}%</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue Session</Text>

        <ArrowRight color={Theme.colors.primary} size={18} />
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Theme.colors.textSecondary,
    letterSpacing: 1.2,
    fontWeight: "600",
    fontSize: 12,
  },

  title: {
    color: Theme.colors.text,
    fontSize: 30,
    fontWeight: "700",
    marginTop: 10,
  },

  progress: {
    color: Theme.colors.primary,
    fontSize: 44,
    fontWeight: "800",
    marginVertical: 18,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    color: Theme.colors.primary,
    fontWeight: "600",
    marginRight: 8,
    fontSize: 15,
  },
});
