/**
 * @description Only professionals can access this pages
 * @access Professionals Only
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

const ProfessionalstDashborad = lazy(
  () => import("../dashboards/Professional/DashboardLayout"),
);
const Home = lazy(() => import("../dashboards/Professional/Home"));

const ProfessionalsRoutes = (
  <Route path="/dashboard/professionals" element={<ProfessionalstDashborad />}>
    <Route index element={<Home />} />
  </Route>
);

export default ProfessionalsRoutes;
