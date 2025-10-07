/**
 * @description A component that guards routes that requires authentication
 * @returns A component that guards routes that requires authentication
 */

import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
  const user = "null"; // Replace with actual authentication logic
  // import isChecking from store
  // if (isChecking) {
  //   return <div>Loading...</div>; // or a spinner
  // }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};

export default AuthGuard;
