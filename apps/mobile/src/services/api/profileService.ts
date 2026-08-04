import { DashboardResponse } from "../../types/dashboard";
import { ProgressResponse } from "../../types/progress";
import apiClient from "./apiClient";

import { ProfileData } from "../../types/profile";

export async function getProfile(): Promise<ProfileData> {
  const [dashboard, progress, history] = await Promise.all([
    apiClient.get<DashboardResponse>("/dashboard"),
    apiClient.get<ProgressResponse>("/progress"),
    apiClient.get("/history"),
  ]);

  return {
    playerName: "Player",

    level:
      dashboard.data.overallScore >= 90
        ? "Elite"
        : dashboard.data.overallScore >= 80
          ? "Advanced"
          : dashboard.data.overallScore >= 70
            ? "Intermediate"
            : "Beginner",

    averageScore: dashboard.data.overallScore,

    totalAnalyses: history.data.length,

    completedTraining: 0,

    streak: dashboard.data.streak,

    favoriteShot:
      history.data.length > 0 ? history.data[0].shotType : "Unknown",

    consistency: progress.data.consistency,
  };
}
