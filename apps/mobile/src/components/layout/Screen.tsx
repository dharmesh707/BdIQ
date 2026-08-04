import type { ReactNode } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

import { Theme } from "../../theme";

import { RefreshControl } from "react-native";
import type { RefreshControlProps } from "react-native";

interface Props {
  children: ReactNode;

  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export default function Screen({ children, refreshControl }: Props) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Theme.colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        contentContainerStyle={{
          padding: 22,

          paddingBottom: 120,
        }}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
