/**
 * @description: Authentication service for backend interactions
 *               - Handles: checkMe, login, register, forgetPassword, resetPassword, logout
 */

import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

// Create an axios instance for auth requests
export const authAxios = axios.create({
  baseURL: "http://localhost:5000/api/v1/auth",
});

// Request interceptor: automatically attach token
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem("accessToken"); // Clear invalid token
      // Optionally, redirect to login page:
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// =========================
// Auth Services
// =========================

export const checkMeService = async () => {
  try {
    const response = await authAxios.get("/me");
    return response.data;
  } catch (error) {
    console.error("CHECK ME SERVICE ERROR:", error.response?.data || error.message);
    handleApiError(error);
  }
};

export const loginService = async (payload) => {
  try {
    const response = await authAxios.post("/login", payload);
    const { token } = response.data;
    if (token) localStorage.setItem("accessToken", token);
    return response.data;
  } catch (error) {
    console.error("LOGIN SERVICE ERROR:", error.response?.data || error.message);
    handleApiError(error);
  }
};

export const registerService = async (payload) => {
  try {
    const response = await authAxios.post("/register", payload);
    return response.data;
  } catch (error) {
    console.error("REGISTER SERVICE ERROR:", error.response?.data || error.message);
    handleApiError(error);
  }
};

export const forgetPasswordService = async ({ email }) => {
  try {
    const response = await authAxios.post("/forget-password", { email });
    return response.data;
  } catch (error) {
    console.error("FORGET PASSWORD SERVICE ERROR:", error.response?.data || error.message);
    handleApiError(error);
  }
};

export const resetPasswordService = async (payload) => {
  try {
    const response = await authAxios.post("/reset-password", payload);
    return response.data;
  } catch (error) {
    console.error("RESET PASSWORD SERVICE ERROR:", error.response?.data || error.message);
    handleApiError(error);
  }
};

export const logoutService = async () => {
  try {
    const response = await authAxios.post("/logout");
    localStorage.removeItem("accessToken"); // clear token on logout
    return response.data;
  } catch (error) {
    console.error("LOGOUT SERVICE ERROR:", error.response?.data || error.message);
    handleApiError(error);
  }
};
