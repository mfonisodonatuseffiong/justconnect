/**
 * @description Only professionals can access this pages
 * @access Professionals Only
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

const ProfessionalsDashboard = lazy(
  () => import("../dashboards/Professional/DashboardLayout"),
);
const Home = lazy(() => import("../dashboards/Professional/Home"));
const Profile = lazy(() => import("../dashboards/Professional/Profile"));
const Services = lazy(() => import("../dashboards/Professional/Services"));
const Messages = lazy(() => import("../dashboards/Professional/Messages"));
const Settings = lazy(() => import("../dashboards/Professional/Settings"));
const Reviews = lazy(() => import("../dashboards/Professional/Reviews"));

const ProfessionalsRoutes = (
  <Route path="/dashboard/professional" element={<ProfessionalsDashboard />}>
    <Route index element={<Home />} />
    <Route path="services" element={<Services />} />
    <Route path="messages" element={<Messages />} />
    <Route path="reviews" element={<Reviews />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
);

export default ProfessionalsRoutes;
