/**
 * @description The routes in this file requires authentication before it can be accessed
 *              And are protected by the AuthGuard
 * @returns Auth route components
 */

import { Route } from "react-router-dom";
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";

import AdminRoutes from "./AdminRoutes";
import ClientsRoutes from "./ClientsRoutes";
import ProfessionalsRoutes from "./ProfessionalsRoutes";

const AuthRoutes = (
  <Route element={<AuthGuard />}>
    {/** routes to admin pages */}
    <Route element={<RoleGuard allowedRoles={["admin"]} />}>
      {AdminRoutes}
    </Route>

    {/** routes to client pages */}
    <Route element={<RoleGuard allowedRoles={["client"]} />}>
      {ClientsRoutes}
    </Route>

    {/** routes to professional pages */}
    <Route element={<RoleGuard allowedRoles={["professional"]} />}>
      {ProfessionalsRoutes}
    </Route>
  </Route>
);

export default AuthRoutes;
