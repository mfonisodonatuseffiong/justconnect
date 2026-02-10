/**
 * @description Authentication store (Zustand)
 * - Persists user and token in localStorage
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

// Load persisted state from localStorage
const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("accessToken");

export const useAuthStore = create((set, get) => ({
  /* ---------------- State ---------------- */
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  error: null,
  isCheckingMe: false,
  hasCheckedMe: false,

  /* ---------------- Derived ---------------- */
  isAuthenticated: () => Boolean(get().user && get().token),

  /* ---------------- Mutators ---------------- */
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, error: null });
    } else {
      localStorage.removeItem("user");
      set({ user: null });
    }
    console.log("🟢 setUser:", user);
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      set({ token });
    } else {
      localStorage.removeItem("accessToken");
      set({ token: null });
    }
    console.log("🟢 setToken:", token);
  },

  setIsCheckingMe: (value) => {
    set({ isCheckingMe: value });
  },

  clearUser: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({
      user: null,
      token: null,
      error: null,
      hasCheckedMe: false,
    });
    console.log("🟠 clearUser called");
  },

  /* ---------------- Actions ---------------- */
  auth: {
    checkMe: async () => {
      if (get().hasCheckedMe) return;

      set({ isCheckingMe: true });
      try {
        const data = await checkMeService();
        const { user } = data || {};
        if (user) {
          get().setUser(user);
        }
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
      set({ error: null, isCheckingMe: true });
      try {
        const data = await loginService(payload);
        const { user, accessToken, refreshToken } = data || {};

        if (!user || !accessToken) {
          throw new Error("Invalid login response");
        }

        get().setToken(accessToken);
        get().setUser(user);

        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        set({ hasCheckedMe: true, isCheckingMe: false });
        console.log("✅ Login success:", { user, accessToken });
        return data;
      } catch (err) {
        get().clearUser();
        set({ error: err.message, isCheckingMe: false, hasCheckedMe: true });
        console.error("💥 Login failed:", err);
        throw err;
      }
    },

    logout: async () => {
      try {
        await logoutService();
        get().clearUser();
        console.log("👋 Logged out");
      } catch (err) {
        throw err;
      }
    },

    register: async (payload) => {
      set({ error: null, isCheckingMe: true });
      try {
        const data = await registerService(payload);
        const { user, accessToken, refreshToken } = data || {};

        if (user) get().setUser(user);
        if (accessToken) get().setToken(accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        set({ hasCheckedMe: true, isCheckingMe: false });
        console.log("✅ Register success:", { user, accessToken });
        return data;
      } catch (err) {
        set({ error: err.message, isCheckingMe: false, hasCheckedMe: true });
        console.error("💥 Register failed:", err);
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
