/**
 * @description Only client can access this pages
 * @access Client Only
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

const ClientDashborad = lazy(() =>
  import("../dashboards/Client/DashboardLayout")
);
const Home = lazy(() => import("../dashboards/Client/Home"));

const ClientRoutes = () => {
  <Route to="/client/dashboard" element={<ClientDashborad />}>
    <Route to="/" element={<Home />} />
  </Route>;
};

export default ClientRoutes;
