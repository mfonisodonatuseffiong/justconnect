// src/tests/AdminLoginFlow.test.jsx
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AppRoutes from "../routes/AppRoutes";

it("navigates to AdminDashboard after admin login", () => {
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
