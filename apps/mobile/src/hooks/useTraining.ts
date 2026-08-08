import { useQuery, useMutation } from "@tanstack/react-query";

import {
  completeTraining,
  getTodayTraining,
} from "../services/api/trainingService";

import { useAuth } from "./useAuth";

export function useTodayTraining() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["training"],
    queryFn: getTodayTraining,
    enabled: isAuthenticated,
  });
}

export function useCompleteTraining() {
  return useMutation({
    mutationFn: completeTraining,
  });
}
