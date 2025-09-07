/**
 * @desc This file fetches user from the store, checks for their roles and grant them access if roles matches
 * @argument Takes an array 
 */

import { Navigate, Outlet  } from "react-router-dom";

const RoleGuard = ({ allowedRoles }) => {
  // fetch user from store
  // fetch isChecking from store
  const user = null;

  if (!user || !user.role) {
    return <Navigate to="/auth/login" replace />
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized-access" replace />
  }
  return <Outlet />
}

export default RoleGuard;