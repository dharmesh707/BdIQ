import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // here is the error

import Screen from "../../components/layout/Screen";
import Header from "../../components/layout/Header";
import SectionTitle from "../../components/ui/SectionTitle/SectionTitle";

import CameraPreviewCard from "../../components/cards/CameraPreviewCard/CameraPreviewCard";
import CameraToolbar from "../../components/camera/CameraToolbar/CameraToolbar";
import SessionCard from "../../components/cards/SessionCard/SessionCard";
import SupportedShotsCard from "../../components/cards/SupportedShotsCard/SupportedShotsCard";

import { uploadVideo } from "../../services/camera/cameraService";

import { RootStackParamList } from "../../navigation/RootStack";
import { useAuth } from "../../hooks/useAuth";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AnalyzeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { isAuthenticated, setPendingVideoId } = useAuth();
  async function handleUpload() {
    try {
      const response = await uploadVideo();

      if (!response) {
        return;
      }

      if (!isAuthenticated) {
        setPendingVideoId(response.video_id);

        navigation.navigate("Login");

        return;
      }

      navigation.navigate("Processing", {
        videoId: response.video_id,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  function handleRecord() {
    // Camera recording will be implemented in a later PR.
    console.log("Record feature coming soon.");
  }

  return (
    <Screen>
      <Header
        title="Analyze Technique"
        subtitle="Upload or record your badminton stroke."
      />

      <CameraPreviewCard />

      <CameraToolbar onUpload={handleUpload} onRecord={handleRecord} />

      <SectionTitle title="Recent Analyses" />

      <SessionCard shot="Jump Smash" score={92} date="Today" />

      <SessionCard shot="Stick Smash" score={88} date="Yesterday" />

      <SessionCard shot="Backhand Drive" score={81} date="Last Week" />

      <SupportedShotsCard />
    </Screen>
  );
}
