/**
 * @desc This file conditionally checks user status
 * @access Blocks all authenticated users from having access to the public routes children
 */

import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AppLoader from "../../components/commonUI/AppLoader";

const GuestGuard = () => {
  const { user, isCheckingMe } = useAuthStore();

  // display a loader while verifying authentication
  if (isCheckingMe) return <AppLoader />;

  // redirect logged in user to home
  if (user) return <Navigate to="/" replace />;

  // if not logged in, allow them in
  return <Outlet />;
};

export default GuestGuard;
