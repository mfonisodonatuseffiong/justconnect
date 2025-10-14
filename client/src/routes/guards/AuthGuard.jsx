/**
 * @description A component that guards routes that requires authentication
 * @returns A component that guards routes that requires authentication
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AppLoader from "../../components/commonUI/AppLoader";

const AuthGuard = () => {
  const { user, isCheckingMe } = useAuthStore();

  // display loader while verifying user
  if (isCheckingMe) return <AppLoader />;

  // redirect the user to login if not signed in
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // allow the user into the page
  return <Outlet />;
};

export default AuthGuard;
