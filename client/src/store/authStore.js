/**
 * @description Authentication store (Zustand)
 * - Persists user in localStorage
 * - Syncs with backend /auth/me
 * - Exposes clean helpers for components
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

const savedUser = localStorage.getItem("user");

export const useAuthStore = create((set, get) => ({
  /* ---------------- State ---------------- */
  user: savedUser ? JSON.parse(savedUser) : null,
  error: null,
  isCheckingMe: false,
  hasCheckedMe: false,

  /* ---------------- Derived ---------------- */
  isAuthenticated: () => Boolean(get().user),

  /* ---------------- Mutators ---------------- */
  setUser: (user) => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, error: null });
  },

  clearUser: () => {
    localStorage.removeItem("user");
    set({
      user: null,
      error: null,
      hasCheckedMe: false,
    });
  },

  /* ---------------- Actions ---------------- */
  auth: {
    checkMe: async () => {
      if (get().hasCheckedMe) return;

      set({ isCheckingMe: true });
      try {
        const data = await checkMeService();
        if (data?.user) get().setUser(data.user);
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
        if (data?.user) get().setUser(data.user);
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
        if (data?.user) get().setUser(data.user);
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
