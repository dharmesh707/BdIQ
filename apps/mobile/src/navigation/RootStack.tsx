import { createNativeStackNavigator } from "@react-navigation/native-stack"; // here is the error

import BottomTabNavigator from "./BottomTabNavigator";

import ProcessingScreen from "../screens/Processing/ProcessingScreen";
import AnalysisResultScreen from "../screens/Result/AnalysisResultScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";

export type RootStackParamList = {
  Main: undefined;

  Login: undefined;

  Register: undefined;

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

      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Register" component={RegisterScreen} />

      <Stack.Screen name="Processing" component={ProcessingScreen} />

      <Stack.Screen name="Analysis" component={AnalysisResultScreen} />
    </Stack.Navigator>
  );
}
