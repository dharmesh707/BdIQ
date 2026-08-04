import { View } from "react-native";

interface Props {
  children: React.ReactNode;
}

export default function Card({ children }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#171717",
        borderRadius: 24,
        padding: 22,
        marginBottom: 24,
      }}
    >
      {children}
    </View>
  );
}
