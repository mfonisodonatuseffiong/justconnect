// src/tests/DashboardLayoutPro.test.jsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DashboardLayoutPro from "../dashboards/Professional/DashboardLayout";

describe("DashboardLayoutPro", () => {
  it("renders nested routes via Outlet", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/professional-dashboard/test"]}>
        <Routes>
          <Route path="/professional-dashboard" element={<DashboardLayoutPro />}>
            <Route path="test" element={<div>Nested Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(getByText("Nested Content")).toBeTruthy();
  });
});
