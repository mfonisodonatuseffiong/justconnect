import axios from "axios";

// ✅ Create an Axios instance with correct base URL
const authAxios = axios.create({
  baseURL: "http://localhost:5000/api/v1", // all calls will be prefixed with /api/v1
  withCredentials: true, // include cookies if backend uses them
});

// ✅ Attach access token to every request automatically
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

// ✅ Handle expired tokens automatically
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        // Call refresh endpoint
        const res = await axios.post(
          "http://localhost:5000/api/v1/auth/refresh",
          { token: refreshToken },
          { withCredentials: true }
        );

        if (res.data?.accessToken) {
          // Save new token
          localStorage.setItem("accessToken", res.data.accessToken);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return authAxios(originalRequest);
        }
      } catch (err) {
        console.error("❌ Token refresh failed:", err.message);
        // Clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default authAxios;
