import apiClient from "./apiClient";

import { DashboardResponse } from "../../types/dashboard"; // here is the error
import { ProgressResponse } from "../../types/progress";

export interface HistoryItem {
  analysisId: string;
  shotType: string;
  score: number;
  date: string;
}

export async function getDashboard() {
  const response = await apiClient.get<DashboardResponse>("/dashboard");

  return response.data;
}

export async function getProgress() {
  const response = await apiClient.get<ProgressResponse>("/progress");

  return response.data;
}

export async function getHistory() {
  const response = await apiClient.get<HistoryItem[]>("/history");

  return response.data;
}
