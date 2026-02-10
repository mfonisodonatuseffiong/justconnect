import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../store/authStore";

describe("Auth Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      error: null,
      isCheckingMe: false,
      hasCheckedMe: false,
    });
  });

  it("should set user and token after login", () => {
    const fakeUser = { id: 23, role: "admin", email: "admin@justconnect.com" };
    const fakeToken = "fake-jwt-token";

    useAuthStore.getState().setUser(fakeUser);
    useAuthStore.getState().setToken(fakeToken);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(fakeUser);
    expect(state.token).toBe(fakeToken);
    expect(state.isAuthenticated()).toBe(true);
  });
});
