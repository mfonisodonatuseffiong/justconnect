/**
 * @desc This file conditionally checks user status
 * @access Blocks all authenticated users from having acces to the public routes children
 */

import { Outlet } from "react-router-dom";
// import Redirect from "../Redirect";

const GuestGuard = () => {
  // fetches user and loading auth from store
  // if user is authenticated send them to redirect

  // condition
  // return <Redirect />

  // if not logged in, allow them in
  return <Outlet />;
};

export default GuestGuard;
