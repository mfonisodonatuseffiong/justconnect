// src/api.js
import axios from "axios";

// ✅ Create a single Axios instance
const authAxios = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

// ✅ Attach token automatically to every request
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Export default so components can import easily
export default authAxios;
