/**
 * @description:   This serves as the main index of our app,think of it as the landing page but its renders dynamically
 * @example:       If a user hits the app landing page, it uses the auth to conditionally check if user is authenticated
 *                 If user is null from auth store, it renders the landing page,
 *                 If user is signed in, it then navigates to dashboard base on user role.
 * @roles           admin, clients, professionals
 * @returns        Home component and Dashboards
 */

import { lazy } from "react";
// import { Navigate } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomePage"));

const Redirect = () => {
  // fetch user from the store
  // fetch isChecking from the store and display a loader

  //renders the home component if user is not logged in

  return <HomePage />;

  // checks for role using the array mapping, returns appropriate route

  // const roleRoute = {
  // admin: "/admin/dashboard",
  // professionals: "/professional/dashboard",
  // client: "/client/dashboard"
  // }

  // return <Navigate to={roleRoute[user.role]} replace />
};

export default Redirect;
