// src/tests/AdminRoute.test.jsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { AdminRoute } from "../routes/AppRoutes"; // ✅ ensure AdminRoute is exported separately

describe("AdminRoute", () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isCheckingMe: false,
    });
  });

  it("renders children if user is admin", () => {
    useAuthStore.setState({
      user: { role: "admin" },
      token: "fake-jwt-token",
      isCheckingMe: false,
    });

    const { getByText } = render(
      <MemoryRouter>
        <AdminRoute>
          <div>Admin Dashboard</div>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("shows loading when isCheckingMe is true", () => {
    useAuthStore.setState({
      user: null,
      token: null,
      isCheckingMe: true,
    });

    const { getByText } = render(
      <MemoryRouter>
        <AdminRoute>
          <div>Admin Dashboard</div>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to login if not admin", () => {
    useAuthStore.setState({
      user: { role: "user" },
      token: "fake-jwt-token",
      isCheckingMe: false,
    });

    const { container } = render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AdminRoute>
          <div>Admin Dashboard</div>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(container.innerHTML).not.toContain("Admin Dashboard");
  });
});
