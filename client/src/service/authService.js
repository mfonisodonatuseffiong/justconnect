/**
 * @description: Authentication service to fetch auth from backend
 *               - Check me, login, sign up, forget password and reset password
 */

import { authAxios } from "../utils/authAxios";

export const CheckMeService = async () => {
  const response = await authAxios.get("/me");
  return response.data;
};

export const loginService = async (payload) => {
  try {
    // fetch the response from backend and return the data
    const response = await authAxios.post("/login", payload);
    return response.data;
  } catch (error) {
    console.error("Error in Login service", error.message);
    const errMsg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Server not currently reachable try again later";
    throw new Error(errMsg);
  }
};

export const registerService = async (payload) => {
  try {
    const response = await authAxios.post("/register", payload);
    return response.data;
  } catch (error) {
    console.error("Error in register service", error.message);
    const errMsg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Server not currently reachable try again later";
    throw new Error(errMsg);
  }
};

export const forgetPasswordService = async ({ email }) => {
  try {
    const response = await authAxios.post("/forget-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error in Forget Password service", error.message);
    const errMsg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Server not currently reachable try again later";
    throw new Error(errMsg);
  }
};

export const resetPasswordService = async (payload) => {
  try {
    const response = await authAxios.post("/reset-password", payload);
    return response.data;
  } catch (error) {
    console.error("Error in Reset Password service", error.message);
    const errMsg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Server not currently reachable try again later";
    throw new Error(errMsg);
  }
};
