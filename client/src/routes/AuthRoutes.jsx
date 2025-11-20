/**
 * @description The routes in this file requires authentication before it can be accessed
 *              And are protected by the AuthGuard
 * @returns Auth route components
 */

import { Route } from "react-router-dom";
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";

import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import ProfessionalsRoutes from "./ProfessionalsRoutes";

const AuthRoutes = (
  // <Route element={<AuthGuard />}> TODO: FIX
  <Route>
    {/** routes to admin pages */}
    <Route element={<RoleGuard allowedRoles={["admin"]} />}>
      {AdminRoutes}
    </Route>

    {/** routes to user pages */}
    <Route element={<RoleGuard allowedRoles={["user"]} />}>{UserRoutes}</Route>

    {/** routes to professional pages */}
    <Route>{ProfessionalsRoutes}</Route>
  </Route>
);

export default AuthRoutes;
