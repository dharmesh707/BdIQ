import { useQuery } from "@tanstack/react-query";

import { getProgress } from "../services/api/dashboardService";

export function useProgress() {
  return useQuery({
    queryKey: ["progress"],
    queryFn: getProgress,
  });
}
