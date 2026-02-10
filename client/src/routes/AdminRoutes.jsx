// src/routes/AdminRoutes.jsx
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../dashboards/Admin/AdminLayout";
import AdminLogin from "../dashboards/Admin/AdminLogin";
import AdminDashboard from "../dashboards/Admin/AdminDashboard";
import AdminUsers from "../dashboards/Admin/AdminUsers";
import AdminProfessionals from "../dashboards/Admin/AdminProfessionals";
import AdminServices from "../dashboards/Admin/AdminServices";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/professionals" element={<AdminProfessionals />} />
        <Route path="/services" element={<AdminServices />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;