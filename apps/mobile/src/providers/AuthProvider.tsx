import { ReactNode, useEffect, useState } from "react";

import { AuthContext, User } from "../context/AuthContext";

import api from "../services/api/apiClient";

import {
  login as loginService,
  logout as logoutService,
  register as registerService,
} from "../services/auth/authService";

import { getToken } from "../services/auth/authStorage";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingVideoId, setPendingVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const token = await getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get("/auth/me");

      setUser(response.data);
    } catch {
      setUser(null);
    }
  }

  async function login(email: string, password: string) {
    await loginService(email, password);

    await refreshUser();
  }

  async function register(email: string, password: string) {
    await registerService(email, password);

    await refreshUser();
  }

  async function logout() {
    await logoutService();

    setUser(null);
  }

  useEffect(() => {
    (async () => {
      await refreshUser();

      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,

        login,
        register,
        logout,
        refreshUser,

        pendingVideoId,
        setPendingVideoId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
