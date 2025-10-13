/**
 * @description:
 *   This serves as the main index (root route) of the app.
 *   - If a user is not authenticated, render the HomePage.
 *   - If authenticated, redirect to their respective dashboard.
 *
 * @example:
 *   - Guests see the landing page.
 *   - Logged-in users are redirected based on their role.
 *
 * @roles: admin, client, professional
 */

import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AppLoader from "../components/commonUI/AppLoader";

const HomePage = lazy(() => import("../pages/HomePage"));

const Redirect = () => {
  const { user, isCheckingMe } = useAuthStore();

  // show loader while checking authentication
  if (isCheckingMe) return <AppLoader />;

  // if user is not logged in, render landing page
  if (!user) return <HomePage />;

  // define dashboard routes based on roles
  const roleRoute = {
    admin: "/admin/dashboard",
    professional: "/professional/dashboard",
    client: "/client/dashboard",
  };

  // fallback in case user.role is unexpected
  const redirectPath = roleRoute[user?.role];

  // redirect authenticated users
  return <Navigate to={redirectPath} replace />;
};

export default Redirect;
