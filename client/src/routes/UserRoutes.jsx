/**
 * @description Only users can access this pages
 * @access users Only
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

const UserDashboard = lazy(() => import("../dashboards/User/DashboardLayout"));
const Home = lazy(() => import("../dashboards/User/Home"));

const ClientRoutes = (
  <Route path="/dashboard" element={<UserDashboard />}>
    <Route index element={<Home />} />
  </Route>
);

export default ClientRoutes;
