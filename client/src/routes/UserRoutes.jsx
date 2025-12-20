/**
 * @description Only users can access these pages
 * @access Users only
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

// Layout
const UserDashboardLayout = lazy(() => import("../dashboards/User/DashboardLayout"));

// Pages
const UserOverview = lazy(() => import("../dashboards/User/UserOverview"));
// You can add more user pages here as needed, e.g. Bookings, Services, Profile, etc.

const UserRoutes = (
  <Route path="/dashboard" element={<UserDashboardLayout />}>
    <Route index element={<UserOverview />} />
    {/* Example: other nested routes */}
    {/* <Route path="bookings" element={<UserBookings />} /> */}
    {/* <Route path="services" element={<UserServices />} /> */}
  </Route>
);

export default UserRoutes;
