/**
 * @description: Authentication store for managing user authentication state.
 * This store uses Zustand for state management and persists the state using localStorage.
 */

import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  error: null,
  isCheckingMe: false,
  setIsCheckingMe: (isCheckingMe) => set({ isCheckingMe }), // loader for check me
  setError: (errorMessage) => set({ error: errorMessage }),
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));
