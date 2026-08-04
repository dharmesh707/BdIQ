import { View, Text } from "react-native";

interface Props {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: Props) {
  return (
    <View
      style={{
        marginBottom: 28,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "700",
        }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          style={{
            color: "#8A8A8A",
            marginTop: 6,
            fontSize: 16,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
