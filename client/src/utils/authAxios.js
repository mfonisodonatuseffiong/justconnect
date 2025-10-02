/**
 * @description: Axios instance with authentication token handling
 * This utility sets up an Axios instance that automatically includes the
 * authentication token in the headers of each request if available.
 */

import axios from "axios";

export const authAxios = axios.create({
  baseURL:
    import.meta.env.VITE_AUTH_API_URL || "http://localhost:5000/api/v1/auth",
  withCredentials: true,
});
