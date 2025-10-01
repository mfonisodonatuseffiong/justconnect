/*
 * @description Only admin can access this pages
 * @access  Admins only
 *
 */


import { lazy } from "react";
import { Route } from "react-router-dom";

const AdminDashboard = lazy(() => import("../dashboards/Admin/DashboardLayout"));
const Home = lazy(() => import("../dashboards/Admin/Home"));

const AdminRoutes = () => {
    <Route to="/admin/dashboard" element={<AdminDashboard />}>
        <Route to="/" element={<Home />} />
    </Route>
}

export default AdminRoutes;