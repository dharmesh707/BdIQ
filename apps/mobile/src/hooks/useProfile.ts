import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../services/api/profileService";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],

    queryFn: getProfile,
  });
}
