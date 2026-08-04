import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import {
  completeTraining,
  getTodayTraining,
} from "../services/api/trainingService";

export function useTodayTraining() {
  return useQuery({
    queryKey: ["training"],

    queryFn: getTodayTraining,
  });
}

export function useCompleteTraining() {
  return useMutation({
    mutationFn: completeTraining,
  });
}
