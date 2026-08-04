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

export interface TrainingCompleteResponse {
  success: boolean;
}
