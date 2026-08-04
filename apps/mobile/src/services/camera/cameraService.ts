import * as ImagePicker from "expo-image-picker";
import api from "../api/apiClient";

export async function uploadVideo() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["videos"],
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  const formData = new FormData();

  formData.append("file", {
    uri: asset.uri,
    type: asset.mimeType ?? "video/mp4",
    name: asset.fileName ?? "stroke.mp4",
  } as any);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
