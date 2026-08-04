import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  LayoutDashboard,
  ScanLine,
  Target,
  ChartSpline,
  CircleUserRound,
} from "lucide-react-native";

import HomeScreen from "../screens/Home/HomeScreen";
import AnalyzeScreen from "../screens/Analyze/AnalyzeScreen";
import LearnScreen from "../screens/Learn/LearnScreen";
import ProgressScreen from "../screens/Progress/ProgressScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

import { Theme } from "../theme";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: Theme.colors.surface,
          borderTopColor: Theme.colors.border,
          borderTopWidth: 1,
          height: 75,
          paddingTop: 8,
          paddingBottom: 8,
        },

        tabBarActiveTintColor: Theme.colors.primary,

        tabBarInactiveTintColor: Theme.colors.textSecondary,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarIcon: ({ color, size, focused }) => {
          const iconSize = focused ? 24 : 22;

          switch (route.name) {
            case "Dashboard":
              return (
                <LayoutDashboard
                  size={iconSize}
                  color={color}
                  strokeWidth={focused ? 2.6 : 2}
                />
              );

            case "Analyze":
              return (
                <ScanLine
                  size={iconSize}
                  color={color}
                  strokeWidth={focused ? 2.6 : 2}
                />
              );

            case "Training":
              return (
                <Target
                  size={iconSize}
                  color={color}
                  strokeWidth={focused ? 2.6 : 2}
                />
              );

            case "Progress":
              return (
                <ChartSpline
                  size={iconSize}
                  color={color}
                  strokeWidth={focused ? 2.6 : 2}
                />
              );

            case "Profile":
              return (
                <CircleUserRound
                  size={iconSize}
                  color={color}
                  strokeWidth={focused ? 2.6 : 2}
                />
              );

            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />

      <Tab.Screen name="Analyze" component={AnalyzeScreen} />

      <Tab.Screen name="Training" component={LearnScreen} />

      <Tab.Screen name="Progress" component={ProgressScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
