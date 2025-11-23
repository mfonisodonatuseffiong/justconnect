/**
 * @description: Authentication service to fetch auth from backend
 *               - Check me, login, sign up, forget password and reset password, log out
 */

import { authAxios } from "../utils/authAxios";
import { handleApiError } from "../utils/handleApiError";

export const checkMeService = async () => {
  try {
    const response = await authAxios.get("/me");
    return response.data;
  } catch (error) {
    console.error("CHECK ME SERVICE ERROR:", error.message);
    handleApiError(error);
  }
};

export const loginService = async (payload) => {
  try {
    const response = await authAxios.post("/login", payload);
    return response.data;
  } catch (error) {
    console.error("LOGIN SERVICE ERROR:", error.message);
    handleApiError(error);
  }
};

export const registerService = async (payload) => {
  try {
    const response = await authAxios.post("/register", payload);
    return response.data;
  } catch (error) {
    console.error("REGISTER SERVICE ERROR:", error.message);
    handleApiError(error);
  }
};

export const forgetPasswordService = async ({ email }) => {
  try {
    const response = await authAxios.post("/forget-password", { email });
    return response.data;
  } catch (error) {
    console.error("FORGET PASSWORD SERVICE ERROR:", error.message);
    handleApiError(error);
  }
};

export const resetPasswordService = async (payload) => {
  try {
    const response = await authAxios.post("/reset-password", payload);
    return response.data;
  } catch (error) {
    console.error("RESET PASSWORD SERVICE ERROR:", error.message);
    handleApiError(error);
  }
};

export const logoutService = async () => {
  try {
    const response = await authAxios.post("/logout");
    return response.data;
  } catch (error) {
    console.error("LOGOUT SERVICE ERROR:", error.message);
    handleApiError(error);
  }
};
