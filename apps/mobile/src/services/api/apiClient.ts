import axios from "axios";

const BASE_URL = __DEV__
  ? "http://10.220.148.31:8000/api/v1"
  : "https://your-deployed-backend.railway.app/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
});

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
