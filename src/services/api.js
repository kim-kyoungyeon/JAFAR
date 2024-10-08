import axios from "axios";
import { getCookie, removeCookie } from "../utils/cookies";

const API_URL = "http://3.39.251.48:8080";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // CORS 관련 쿠키를 포함시킵니다.
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getCookie("jwt");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/logout");
    removeCookie("jwt");
  } catch (error) {
    throw error;
  }
};

export default api;
