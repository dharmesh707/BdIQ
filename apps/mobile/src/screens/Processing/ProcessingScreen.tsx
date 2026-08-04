import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../components/layout/Screen";
import Header from "../../components/layout/Header";

import { Theme } from "../../theme";

import { RootStackParamList } from "../../navigation/RootStack";

import { analyzeVideo } from "../../services/analyze/analyzeService";

type Props = NativeStackScreenProps<RootStackParamList, "Processing">;

export default function ProcessingScreen({ navigation, route }: Props) {
  const { videoId } = route.params;

  const [status, setStatus] = useState("Uploading analysis...");

  useEffect(() => {
    runAnalysis();
  }, []);

  async function runAnalysis() {
    try {
      setStatus("Running AI pose estimation...");

      const analysis = await analyzeVideo(videoId);

      setStatus("Generating coaching feedback...");

      setTimeout(() => {
        navigation.replace("Analysis", {
          analysis,
        });
      }, 700);
    } catch (error) {
      console.log(error);

      setStatus("Analysis failed.");

      setTimeout(() => {
        navigation.goBack();
      }, 1800);
    }
  }

  return (
    <Screen>
      <Header
        title="Analyzing Stroke"
        subtitle="AI is processing your badminton technique."
      />

      <View style={styles.container}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />

        <Text style={styles.title}>Please wait...</Text>

        <Text style={styles.subtitle}>{status}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",
  },

  title: {
    marginTop: 25,

    fontSize: 22,

    fontWeight: "700",

    color: Theme.colors.text,
  },

  subtitle: {
    marginTop: 10,

    textAlign: "center",

    color: Theme.colors.textSecondary,

    fontSize: 15,

    width: "80%",
  },
});
