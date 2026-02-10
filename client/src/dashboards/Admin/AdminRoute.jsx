import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AdminRoute({ children }) {
  const { user, token } = useAuthStore();
  const isAdmin = user?.role === "admin" && token;

  return isAdmin ? children : <Navigate to="/auth/login" replace />;
}
