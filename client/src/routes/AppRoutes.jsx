// src/routes/AppRoutes.jsx
/**
 * @description All app routes for authentication and dashboards
 */

import { Routes, Route } from "react-router-dom";

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
import RequestsPage from "../dashboards/User/RequestsPage";
import BookingsPage from "../dashboards/User/BookingsPage";
import MessagesPage from "../dashboards/User/MessagesPage";
import ProfilePage from "../dashboards/User/ProfilePage";
import SettingsPage from "../dashboards/User/SettingsPage";

/** Auth Pages */
import LoginPage from "../auth/LoginPage";
import RegistrationPage from "../auth/RegistrationPage";

/** Public Pages */
import HomePage from "../pages/HomePage"; // hero page

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      {/* Auth */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<RegistrationPage />} />

      {/* Professional Dashboard */}
      <Route path="/professional-dashboard" element={<DashboardLayoutPro />}>
        <Route index element={<Overview />} />
        <Route path="bookings" element={<BookingsPro />} />
        <Route path="services" element={<Services />} />
        <Route path="profile" element={<ProfilePro />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<SettingsPro />} />
      </Route>

      {/* User Dashboard */}
      <Route path="/user-dashboard" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;
