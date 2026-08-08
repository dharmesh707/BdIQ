import { useQuery } from "@tanstack/react-query";

import { useAuth } from "./useAuth";

import { getProfile } from "../services/api/profileService";

export function useProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["profile"],

    queryFn: getProfile,

    enabled: isAuthenticated,
  });
}
