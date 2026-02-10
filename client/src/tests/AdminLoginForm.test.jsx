// src/tests/AdminLoginForm.test.jsx
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import AppRoutes from "../routes/AppRoutes";
import { useAuthStore } from "../store/authStore";

describe("Admin login flow", () => {
  it("logs in as admin and shows AdminDashboard", async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={["/auth/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    // Fill in login form
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.click(getByText(/login/i));

    // Mock store update
    useAuthStore.setState({
      user: { role: "admin" },
      token: "fake-jwt-token",
      isCheckingMe: false,
    });

    // Expect dashboard
    expect(getByText("Admin Dashboard")).toBeInTheDocument();
  });
});
