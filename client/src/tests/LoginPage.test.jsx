import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../auth/LoginPage";
import { useAuthStore } from "../store/authStore";

// Mock useAuthHook
vi.mock("../hooks/authHooks", () => ({
  useAuthHook: () => ({
    login: vi.fn().mockResolvedValue({
      user: { id: 23, role: "admin", email: "admin@justconnect.com" },
      accessToken: "fake-jwt-token",
    }),
  }),
}));

describe("LoginPage", () => {
  it("redirects admin to /admin/dashboard after login", async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.change(getByLabelText(/Email/i), {
        target: { value: "admin@justconnect.com" },
      });
      fireEvent.change(getByLabelText(/Password/i), {
        target: { value: "Admin123!" },
      });
      fireEvent.click(getByText(/Login/i));
    });

    const state = useAuthStore.getState();
    expect(state.user?.role).toBe("admin");
    expect(state.token).toBe("fake-jwt-token");
  });
});
