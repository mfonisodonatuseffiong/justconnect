/**
 * @description Only professionals can access this pages
 * @access Professionals Only
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

const ProfessionalstDashborad = lazy(() =>
  import("../dashboards/Professional/DashboardLayout")
);
const Home = lazy(() => import("../dashboards/Professional/Home"));

const ProfessionalsRoutes = () => {
  <Route to="/client/dashboard" element={<ProfessionalstDashborad />}>
    <Route to="/" element={<Home />} />
  </Route>;
};

export default ProfessionalsRoutes;
