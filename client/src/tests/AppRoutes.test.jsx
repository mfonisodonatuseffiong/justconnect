// src/tests/AppRoutes.test.jsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AppRoutes from "../routes/AppRoutes";

describe("AppRoutes integration", () => {
  it("renders AdminDashboard when user is admin", () => {
    // ✅ Mock store state
    useAuthStore.setState({
      user: { role: "admin" },
      token: "fake-jwt-token",
      isCheckingMe: false,
    });

    const { getByText } = render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    // ✅ Should render AdminDashboard content
    expect(getByText("Admin Dashboard")).toBeInTheDocument();
    expect(getByText(/Welcome, admin!/i)).toBeInTheDocument();
  });

  it("redirects to login if not admin", () => {
    useAuthStore.setState({
      user: { role: "user" },
      token: "fake-jwt-token",
      isCheckingMe: false,
    });

    const { getByText } = render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    // ✅ Should show login page content
    expect(getByText(/Login/i)).toBeInTheDocument();
  });

  it("shows loading when isCheckingMe is true", () => {
    useAuthStore.setState({
      user: null,
      token: null,
      isCheckingMe: true,
    });

    const { getByText } = render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(getByText("Loading...")).toBeInTheDocument();
  });
});
