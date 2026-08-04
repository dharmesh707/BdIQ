export interface JointAngles {
  shoulder: number;
  elbow: number;
  hip: number;
  knee: number;
}

export interface MetricScores {
  smashPower: number;
  timing: number;
  footwork: number;
  balance: number;
  recovery: number;
}

export interface ProfessionalComparison {
  player: string;
  similarity: number;
}

export interface DrillRecommendation {
  title: string;
  duration: string;
  difficulty: string;
}

export interface AnalysisResponse {
  analysisId: string;
  overallScore: number;
  shotType: string;

  metrics: MetricScores;

  jointAngles: JointAngles;

  professionalComparison: ProfessionalComparison;

  strengths: string[];

  mistakes: string[];

  recommendations: DrillRecommendation[];
}
