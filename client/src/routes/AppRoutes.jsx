// src/routes/AppRoutes.jsx
/**
 * @description All app routes for authentication and dashboards
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/** Professional Dashboard Pages */
import DashboardLayoutPro from "../dashboards/Professional/DashboardLayout";
import Overview from "../dashboards/Professional/Overview";
import BookingsPro from "../dashboards/Professional/Bookings";
import Services from "../dashboards/Professional/Services";
import ProfilePro from "../dashboards/Professional/Profile";
import Reviews from "../dashboards/Professional/Reviews";
import SettingsPro from "../dashboards/Professional/Settings";

/** User Dashboard Pages */
import DashboardLayout from "../dashboards/User/DashboardLayout";
import Home from "../dashboards/User/Home";
import BookingsPage from "../dashboards/User/BookingsPage";
import MessagesPage from "../dashboards/User/MessagesPage";
import ProfilePage from "../dashboards/User/ProfilePage";
import SettingsPage from "../dashboards/User/SettingsPage";

/** Admin Dashboard Page */
import AdminDashboard from "../dashboards/Admin/AdminDashboard";

/** Auth Pages */
import LoginPage from "../auth/LoginPage";
import RegistrationPage from "../auth/RegistrationPage";

/** Public Pages */
import HomePage from "../pages/HomePage"; // hero page

/** -------- Route Guards -------- */
export const AdminRoute = ({ children }) => {
  const { user, token, isCheckingMe } = useAuthStore();
  if (isCheckingMe) return <div>Loading...</div>;
  const isAdmin = user?.role === "admin" && token;
  return isAdmin ? children : <Navigate to="/auth/login" replace />;
};

export const UserRoute = ({ children }) => {
  const { user, token, isCheckingMe } = useAuthStore();
  if (isCheckingMe) return <div>Loading...</div>;
  const isUser = user?.role === "user" && token;
  return isUser ? children : <Navigate to="/auth/login" replace />;
};

export const ProfessionalRoute = ({ children }) => {
  const { user, token, isCheckingMe } = useAuthStore();
  if (isCheckingMe) return <div>Loading...</div>;
  const isPro = user?.role === "professional" && token;
  return isPro ? children : <Navigate to="/auth/login" replace />;
};

/** -------- Redirect After Login -------- */
const RedirectAfterLogin = () => {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/auth/login" replace />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "professional":
      return <Navigate to="/professional-dashboard" replace />;
    case "user":
      return <Navigate to="/user-dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

/** -------- Routes -------- */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      {/* Auth */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<RegistrationPage />} />

      {/* Redirect after login */}
      <Route path="/redirect" element={<RedirectAfterLogin />} />

      {/* Professional Dashboard */}
      <Route
        path="/professional-dashboard"
        element={
          <ProfessionalRoute>
            <DashboardLayoutPro />
          </ProfessionalRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="bookings" element={<BookingsPro />} />
        <Route path="services" element={<Services />} />
        <Route path="profile" element={<ProfilePro />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<SettingsPro />} />
      </Route>

      {/* User Dashboard */}
      <Route
        path="/user-dashboard"
        element={
          <UserRoute>
            <DashboardLayout />
          </UserRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Fallback - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
