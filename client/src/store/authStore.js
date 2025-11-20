/**
 * @description: Authentication store for managing user authentication state.
 * This store uses Zustand for state management and persists the state using localStorage.
 */

import { create } from "zustand";
import {
  checkMeService,
  forgetPasswordService,
  loginService,
  logoutService,
  registerService,
  resetPasswordService,
} from "../service/authService";

export const useAuthStore = create((set) => ({
  user: null,
  error: null,
  isCheckingMe: false,

  auth: {
    // Check authentication
    checkMe: async () => {
      set({ isCheckingMe: true });
      try {
        const data = await checkMeService();
        set({ user: data.user, error: null });
        return data;
      } catch (err) {
        set({ user: null, error: err.message });
      } finally {
        set({ isCheckingMe: false });
      }
    },

    // Log in
    login: async (payload) => {
      set({ error: null });
      try {
        const data = await loginService(payload);
        set({ user: data.user, error: null });
        return data;
      } catch (err) {
        set({ user: null, error: err.message });
        throw err;
      }
    },

    // Log out
    logout: async () => {
      try {
        const data = await logoutService();
        set({ user: null, error: null });
        return data;
      } catch (err) {
        console.error("LOGOUT STORE ERROR:", err.message);
      }
    },

    // Sign up
    register: async (payload) => {
      set({ error: null });
      try {
        const data = await registerService(payload);
        set({ user: data.user , error: null});
        return data;
      } catch (err) {
        console.error("REGISTER STORE ERROR:", err.message);
        set({ user: null, error: err.message });
        throw err;
      }
    },

    // Forget password
    forgetPassword: async (email) => {
      set({ error: null });
      try {
        const data = await forgetPasswordService(email);
        return data;
      } catch (err) {
        console.error("FORGET PASSWORD STORE ERROR:", err.message);
        set({ error: err.message });
        throw err;
      }
    },

    // Forget password
    resetPassword: async (payload) => {
      set({ error: null });
      try {
        const data = await resetPasswordService(payload);
        return data;
      } catch (err) {
        console.error("RESET PASSWORD STORE ERROR:", err.message);
        set({ error: err.message });
        throw err;
      }
    },
  },
}));
