import axios from "axios";

import { getToken } from "../auth/authStorage";

const BASE_URL = __DEV__
  ? process.env.EXPO_PUBLIC_API_URL || "http://172.30.178.31:8000/api/v1"
  : "https://your-deployed-backend.railway.app/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});

// Automatically attach JWT if available
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail || error.message || "Something went wrong";

    console.error("[API Error]", message);

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
