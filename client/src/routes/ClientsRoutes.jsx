/**
 * @description Only client can access this pages
 * @access Client Only
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

const ClientDashboard = lazy(
  () => import("../dashboards/Client/DashboardLayout"),
);
const Home = lazy(() => import("../dashboards/Client/Home"));

const ClientRoutes = (
  <Route path="/dashboard/client" element={<ClientDashboard />}>
    <Route index element={<Home />} />
  </Route>
);

export default ClientRoutes;
