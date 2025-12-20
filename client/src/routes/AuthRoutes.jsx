/**
 * @desc This file holds all routes in the app
 *       including public, guest, and authenticated routes
 */

import { Fragment } from "react";
import { Route } from "react-router-dom";

// PROFESSIONAL DASHBOARD
import DashboardLayout from "../dashboards/Professional/DashboardLayout";
import ProfessionalHome from "../dashboards/Professional/Overview"; // Your main professional dashboard page
import ProfessionalBookings from "../dashboards/Professional/Bookings";
import ProfessionalServices from "../dashboards/Professional/Services";
import ProfessionalSettings from "../dashboards/Professional/Settings";

// USER DASHBOARD
import UserDashboardLayout from "../dashboards/User/DashboardLayout";
import UserHome from "../dashboards/User/Home";

const AuthRoutes = (
  <Fragment>
    {/* PROFESSIONAL DASHBOARD */}
    <Route path="/professional-dashboard" element={<DashboardLayout />}>
      <Route index element={<ProfessionalHome />} />
      <Route path="bookings" element={<ProfessionalBookings />} />
      <Route path="services" element={<ProfessionalServices />} />
      <Route path="settings" element={<ProfessionalSettings />} />
    </Route>

    {/* USER DASHBOARD */}
    <Route path="/user-dashboard" element={<UserDashboardLayout />}>
      <Route index element={<UserHome />} />
    </Route>
  </Fragment>
);

export default AuthRoutes;
