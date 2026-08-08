import { createContext } from "react";

export interface User {
  id: string;
  email: string;
  height_cm?: number;
  primary_template_id?: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;

  // NEW
  pendingVideoId: string | null;
  setPendingVideoId: (videoId: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
