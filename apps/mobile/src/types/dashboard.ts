export interface SkillBreakdown {
  smash: number;
  drive: number;
  drop: number;
  netPlay: number;
  footwork: number;
}

export interface DashboardResponse {
  overallScore: number;
  weeklyProgress: number;
  streak: number;
  coachInsight: string;

  skillBreakdown: SkillBreakdown;
}
