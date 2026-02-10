import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import AdminLogin from "../auth/AdminLogin";   // ✅ fixed
import AppRoutes from "../routes/AppRoutes";   // ✅ fixed

vi.mock("../api", () => ({
  default: {
    post: vi.fn(() =>
      Promise.resolve({
        data: {
          accessToken: "fake-token",
          user: { id: 1, email: "admin@justconnect.com", role: "admin" },
        },
      })
    ),
  },
}));

describe("AdminLogin flow", () => {
  it("logs in as admin and redirects to /admin/dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/auth/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), {
      target: { value: "admin@justconnect.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/admin/dashboard");
    });

    expect(localStorage.getItem("accessToken")).toBe("fake-token");
    const user = JSON.parse(localStorage.getItem("user"));
    expect(user.role).toBe("admin");
  });
});
