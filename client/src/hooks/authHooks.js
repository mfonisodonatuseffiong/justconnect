/**
 * @description This handles all auth hooks
 *              auth is an object from the store that holds auth.login, auth.logout, auth.register e.t.c
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
  const { auth, user, error } = useAuthStore();

  // A validation function + validate user input
  const validate = (schema, payload) => {
    const { error: validateError } = schema.validate(payload);
    if (validateError) {
      throw new Error(validateError.details[0].message);
    }
  };

  // Callback to memorize data
  const checkMe = useCallback(async () => {
    try {
      await auth.checkMe();
    } catch (err) {
      console.error(err.message);
    }
  }, [auth]);

  return {
    user,
    error,
    auth,
    isAuthenticated: !!user,

    // Check user
    checkMe,

    // Validate input when user calls function
    login: async (payload) => {
      validate(loginSchema, payload);
      return await auth.login(payload);
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
  };
};
