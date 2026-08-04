import { useQuery } from "@tanstack/react-query";

import { getHistory } from "../services/api/dashboardService";

export function useHistory() {
  return useQuery({
    queryKey: ["history"],

    queryFn: getHistory,
  });
}
