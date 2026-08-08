import { StatusBar } from "expo-status-bar";

import QueryProvider from "./src/providers/QueryProvider";
import AuthProvider from "./src/providers/AuthProvider";

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AuthProvider>
    </QueryProvider>
  );
}
