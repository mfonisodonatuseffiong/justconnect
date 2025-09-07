/**
 * @description The routes in this file are all public routes but, are routes that shouldn't be accessed by auth user
 *              Protected by the guestGuard component
 * @access      Only users that are not logged
 * @return      GuestRoutes
 */

import { lazy } from "react";
import { Route } from "react-router-dom";
import GuestGuard from "./guards/GuestGuard";

const Login = lazy(() => import("../auth/LoginPage"));
const SignUp = lazy(() => import("../auth/RegistrationPage"));
const ForgetPassword = lazy(() => import("../auth/ForgetPasswordPage"));
const ResetPassword = lazy(() => import("../auth/ResetPasswordPage"));

const GuestRoutes = (
  <Route element={<GuestGuard />}>
    <Route path="/auth/login" element={<Login />} />
    <Route path="/auth/signup" element={<SignUp />} />
    <Route path="/auth/forget-password" element={<ForgetPassword />} />
    <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
  </Route>
);

export default GuestRoutes;
