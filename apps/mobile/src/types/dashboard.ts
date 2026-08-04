export interface SkillBreakdown {
  smash: number;
  drive: number;
  drop: number;
  netPlay: number;
  footwork: number;
}

export interface RecentSession {
  shotType: string;
  score: number;
  date: string;
}

export interface DashboardResponse {
  overallScore: number;
  weeklyProgress: number;
  streak: number;
  skillBreakdown: SkillBreakdown;
  recentSessions: RecentSession[];
  coachInsight: string;
}
