/**
 * @description: Authentication store for managing user authentication state.
 * This store uses Zustand for state management and persists the state using localStorage.
 */

import { create } from "zustand";

export const useAuthStore = create((set) => ({
        user: null,
        token: null,
        setUser: (userData) => set({ user: userData }),
    })

);