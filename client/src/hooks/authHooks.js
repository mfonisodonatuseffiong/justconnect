/**
 * @description Auth hook for handling login, logout, register, and password flows.
 *              Integrates with authStore and ensures tokens are stored consistently.
 */

import { useCallback } from "react";
import { useAuthStore } from "../store/authStore";

import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validation/authValidation";

export const useAuthHook = () => {
  const { auth, user, error, clearUser } = useAuthStore();

  // Validate user input against schema
  const validate = (schema, payload) => {
    const { error: validateError } = schema.validate(payload);
    if (validateError) {
      throw new Error(validateError.details[0].message);
    }
  };

  // Check authenticated user
  const checkMe = useCallback(async () => {
    try {
      await auth.checkMe();
    } catch (err) {
      console.error("Auth check failed:", err.message);
      clearUser(); // clear user if token invalid
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }, [auth, clearUser]);

  return {
    user,
    error,
    auth,
    isAuthenticated: !!user,

    checkMe,

    login: async (payload) => {
      validate(loginSchema, payload);

      const response = await auth.login(payload);

      if (response?.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }
      if (response?.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }

      return response;
    },

    register: async (payload) => {
      validate(registerSchema, payload);
      return await auth.register(payload);
    },

    forgetPassword: async (payload) => {
      validate(forgetPasswordSchema, payload);
      return await auth.forgetPassword(payload);
    },

    resetPassword: async (payload) => {
      validate(resetPasswordSchema, payload);
      return await auth.resetPassword(payload);
    },

    logout: async () => {
      try {
        await auth.logout();
      } catch (err) {
        console.error("Logout failed:", err.message);
      } finally {
        clearUser();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    },
  };
};
