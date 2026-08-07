import api from "../api/apiClient";
import { saveToken, deleteToken } from "./authStorage";

export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  await saveToken(response.data.access_token);

  return response.data;
}

export async function register(email: string, password: string) {
  const response = await api.post("/auth/register", {
    email,
    password,
  });

  await saveToken(response.data.access_token);

  return response.data;
}

export async function logout() {
  await deleteToken();
}
