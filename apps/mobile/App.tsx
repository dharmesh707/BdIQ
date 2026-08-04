import { StatusBar } from "expo-status-bar";

import QueryProvider from "./src/providers/QueryProvider";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <QueryProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </QueryProvider>
  );
}
