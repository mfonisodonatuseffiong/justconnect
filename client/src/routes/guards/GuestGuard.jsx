/**
 * @desc Restricts authenticated users from accessing public routes
 * @access Public routes only
 */

import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import AppLoader from "../../components/commonUI/AppLoader";

const GuestGuard = () => {
  const { user, isCheckingMe, hasCheckedMe } = useAuthStore();

  // ⏳ Still checking auth status
  if (!hasCheckedMe || isCheckingMe) {
    return <AppLoader />;
  }

  // 🔐 User already logged in → redirect to dashboard or home
  if (user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // ✅ Guest user → allow access
  return <Outlet />;
};

export default GuestGuard;
