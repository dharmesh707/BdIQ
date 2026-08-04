import { useMutation } from "@tanstack/react-query";
import { uploadVideo } from "../services/camera/cameraService";

export function useUploadVideo() {
  return useMutation({
    mutationFn: uploadVideo,
  });
}
