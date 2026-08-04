import { useMutation } from "@tanstack/react-query";
import { analyzeVideo } from "../services/analyze/analyzeService";

export function useAnalyzeVideo() {
  return useMutation({
    mutationFn: analyzeVideo,
  });
}
