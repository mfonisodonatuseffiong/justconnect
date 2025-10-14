/**
 * @desc This file fetches user from the store, checks for their roles and grant them access if roles matches
 * @argument Takes an array
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AppLoader from "../../components/commonUI/AppLoader";

const RoleGuard = ({ allowedRoles }) => {
  const { user, isCheckingMe } = useAuthStore();

  // display a loader while authenticating
  if (isCheckingMe) return <AppLoader />;

  // if not logged in redirect user to login page
  if (!user || !user.role) return <Navigate to="/auth/login" replace />;

  // if user role is not in the allowed role list
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized-access" replace />;
  }
  return <Outlet />;
};

export default RoleGuard;
