import { useQuery } from "@tanstack/react-query";

import { useAuth } from "./useAuth";

import { getDashboard } from "../services/api/dashboardService";

export function useDashboard() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: isAuthenticated,
  });
}
