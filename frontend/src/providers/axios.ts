// src/providers/axios.ts
import axios from "axios";

export const API_URL = "http://localhost:8000"; // FastAPI backend

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add JWT token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // you stored it after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("found the token")
  }
  else console.log("NO token found")
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   // Token invalid → clear & redirect to login
    //   localStorage.removeItem("access_token");
    //   window.location.href = "/login"; // Or refine's redirect
    // }
    // return Promise.reject(error);
    if (error.response) {
      console.error("🔴 API Error Response:", error.response.data);
      console.error("🔴 Status:", error.response.status);
      console.error("🔴 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("🟡 No Response Received:", error.request);
    } else {
      console.error("⚠️ Axios Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);
