import axios from "axios";
import { API_URL } from "../config/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export default api;

api.interceptors.request.use((config) => {
  console.log("➡", config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response?.data);
    return Promise.reject(error);
  },
);
