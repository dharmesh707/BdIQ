import { useQuery } from "@tanstack/react-query";

import {
  getDashboard,
  getHistory,
  getProgress,
} from "../services/api/dashboardService";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],

    queryFn: getDashboard,
  });
}

export function useHistory() {
  return useQuery({
    queryKey: ["history"],

    queryFn: getHistory,
  });
}

export function useProgress() {
  return useQuery({
    queryKey: ["progress"],

    queryFn: getProgress,
  });
}
