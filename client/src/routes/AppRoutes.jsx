/**
 * @desc This is a file that holds all routes in the app
 *      - from authentication pages to unauthorized page and dashboard
 *      - Lazy loading is applied to optimize app performance for fast loading
 *
 * @return all pages of the page
 */

import { Suspense } from "react";
import { Routes } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";
import GuestRoutes from "./guestRoutes";
import AuthRoutes from "./AuthRoutes";

export const AppRoutes = () => {
  return (
    <Suspense fallback="Loading...">
      <Routes>
        {PublicRoutes}
        {GuestRoutes}
        {AuthRoutes} {/** Routes that requires log in before visiting */}
      </Routes>
    </Suspense>
  );
};
