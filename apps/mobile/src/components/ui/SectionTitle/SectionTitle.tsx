import { Text } from "react-native";

interface Props {
  title: string;
}

export default function SectionTitle({ title }: Props) {
  return (
    <Text
      style={{
        color: "white",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 18,
      }}
    >
      {title}
    </Text>
  );
}
