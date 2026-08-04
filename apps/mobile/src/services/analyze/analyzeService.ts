import api from "../api/apiClient";

export async function analyzeVideo(videoId: string) {
  const formData = new FormData();

  formData.append("video_id", videoId);

  const response = await api.post("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
