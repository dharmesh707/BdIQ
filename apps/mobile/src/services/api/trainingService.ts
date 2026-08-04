import apiClient from "./apiClient";

export interface TrainingDrill {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  targetMetric: string;
  expectedImprovement: string;
  reason: string;
  completed: boolean;
}

export interface TrainingTodayResponse {
  drills: TrainingDrill[];
}

export async function getTodayTraining() {
  const response =
    await apiClient.get<TrainingTodayResponse>("/training/today");

  return response.data;
}

export async function completeTraining(id: string) {
  await apiClient.post("/training/complete", {
    trainingId: id,
  });
}
