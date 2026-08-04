import { StyleSheet, Text } from "react-native";

import Card from "../../ui/Card/Card";

import { Theme } from "../../../theme";

interface Props {
  name: string;

  level: string;
}

export default function ProfileHeaderCard({ name, level }: Props) {
  return (
    <Card>
      <Text style={styles.name}>{name}</Text>

      <Text style={styles.level}>{level}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 30,
    fontWeight: "800",
    color: Theme.colors.text,
  },

  level: {
    marginTop: 8,
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 18,
  },
});
