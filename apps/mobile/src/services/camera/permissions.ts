import { Camera } from "expo-camera";

export async function requestCameraPermission() {
  const { status } = await Camera.requestCameraPermissionsAsync();

  return status === "granted";
}
