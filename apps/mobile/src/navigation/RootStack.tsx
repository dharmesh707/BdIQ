import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabNavigator from "./BottomTabNavigator";

import ProcessingScreen from "../screens/Processing/ProcessingScreen";
import AnalysisResultScreen from "../screens/Result/AnalysisResultScreen";

export type RootStackParamList = {
  Main: undefined;

  Processing: {
    videoId: string;
  };

  Analysis: {
    analysis: any;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />

      <Stack.Screen name="Processing" component={ProcessingScreen} />

      <Stack.Screen name="Analysis" component={AnalysisResultScreen} />
    </Stack.Navigator>
  );
}
