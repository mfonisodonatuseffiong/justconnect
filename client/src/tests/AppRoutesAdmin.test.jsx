// src/tests/AppRoutesAdmin.test.jsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AppRoutes from "../routes/AppRoutes";

describe("Admin login integration", () => {
  it("renders AdminDashboard when user is admin", () => {
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

    expect(getByText("Admin Dashboard")).toBeInTheDocument();
  });
});
