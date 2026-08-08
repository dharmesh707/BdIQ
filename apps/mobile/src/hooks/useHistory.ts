import { useQuery } from "@tanstack/react-query";

import { useAuth } from "./useAuth";

import { getHistory, HistoryItem } from "../services/api/dashboardService";

export function useHistory() {
  const { isAuthenticated } = useAuth();

  return useQuery<HistoryItem[]>({
    queryKey: ["history"],
    queryFn: getHistory,
    enabled: isAuthenticated,
  });
}
