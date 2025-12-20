/**
 * @description: Authentication store (Zustand)
 * - Exposes setUser and clearUser for proper logout/login handling
 * - Clean, stable, industry-standard version
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

export const useAuthStore = create((set, get) => ({
  user: null,
  error: null,
  isCheckingMe: false,
  hasCheckedMe: false,

  // 🔥 Exposed state helpers for components
  setUser: (user) => set({ user, error: null }),
  clearUser: () => set({ user: null, error: null, hasCheckedMe: false }),

  auth: {
    checkMe: async () => {
      const { hasCheckedMe } = get();
      if (hasCheckedMe) return;

      set({ isCheckingMe: true });
      try {
        const data = await checkMeService();
        set({ user: data.user, error: null, hasCheckedMe: true });
        return data;
      } catch (err) {
        set({ user: null, error: err.message, hasCheckedMe: true });
      } finally {
        set({ isCheckingMe: false });
      }
    },

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

    logout: async () => {
      try {
        await logoutService();
        get().clearUser(); // ✅ use exposed clearUser
      } catch (err) {
        console.error("LOGOUT ERROR:", err.message);
        throw err;
      }
    },

    register: async (payload) => {
      set({ error: null });
      try {
        const data = await registerService(payload);
        set({ user: data.user, error: null });
        return data;
      } catch (err) {
        set({ error: err.message });
        throw err;
      }
    },

    forgetPassword: async (email) => {
      set({ error: null });
      try {
        return await forgetPasswordService(email);
      } catch (err) {
        set({ error: err.message });
        throw err;
      }
    },

    resetPassword: async (payload) => {
      set({ error: null });
      try {
        return await resetPasswordService(payload);
      } catch (err) {
        set({ error: err.message });
        throw err;
      }
    },
  },
}));
