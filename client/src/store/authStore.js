/**
 * @description: Authentication store (Zustand)
 * - Clean, stable, industry-standard
 * - Properly exposes setUser and clearUser
 * - Ready for profile picture updates and real-time features
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

  // 🔥 Exposed helpers — use these in components
  setUser: (user) => set({ user, error: null }),
  clearUser: () => set({ user: null, error: null, hasCheckedMe: false }),

  auth: {
    checkMe: async () => {
      const { hasCheckedMe } = get();
      if (hasCheckedMe) return;

      set({ isCheckingMe: true });
      try {
        const data = await checkMeService();
        get().setUser(data.user); // ← Use exposed setUser
        set({ hasCheckedMe: true });
        return data;
      } catch (err) {
        get().clearUser();
        set({ error: err.message, hasCheckedMe: true });
      } finally {
        set({ isCheckingMe: false });
      }
    },

    login: async (payload) => {
      set({ error: null });
      try {
        const data = await loginService(payload);
        get().setUser(data.user);
        return data;
      } catch (err) {
        get().clearUser();
        set({ error: err.message });
        throw err;
      }
    },

    logout: async () => {
      try {
        await logoutService();
        get().clearUser();
      } catch (err) {
        console.error("LOGOUT ERROR:", err.message);
        throw err;
      }
    },

    register: async (payload) => {
      set({ error: null });
      try {
        const data = await registerService(payload);
        get().setUser(data.user);
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