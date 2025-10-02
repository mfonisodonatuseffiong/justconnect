/**
 * @description List of all admin routes
 * @access Admins Only
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

const AdminDashboard = lazy(
  () => import("../dashboards/Admin/DashboardLayout"),
);
const Home = lazy(() => import("../dashboards/Admin/Home"));

const AdminRoutes = (
  <Route path="/admin/dashboard" element={<AdminDashboard />}>
    <Route index element={<Home />} />
  </Route>
);

export default AdminRoutes;
