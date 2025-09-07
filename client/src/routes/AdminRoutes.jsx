/*
 * @description Only admin can access this pages
 * @access  Admins only
 *
 */


import { lazy } from "react";
import { Route } from "react-router-dom";

const AdminDashborad = lazy(() => import("../dashboards/Admin/DashboardLayout"));
const Home = lazy(() => import("../dashboards/Admin/Home"));

const AdminRoutes = () => {
    <Route to="/admin/dashboard" element={<AdminDashborad />}>
        <Route to="/" element={<Home />} />
    </Route>
}

export default AdminRoutes;