// src/api.js
import axios from "axios";

const authAxios = axios.create({
  baseURL: "http://localhost:5000/api/v1", // ✅ only once
  withCredentials: true,
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authAxios;
