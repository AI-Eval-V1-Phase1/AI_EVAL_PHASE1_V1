import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  normalizeSystemRole,
  isPathAllowedForUserRole,
  type SystemRole,
} from "./rbacConfig";

const SYSTEM_ROLE_KEY = "systemRole";
const USER_ROLE_KEY = "userRole";
const NOT_FOUND_PATH = "/pageNotFound";

/**
 * Route guard: enforces RBAC by system role and user role (e.g. vendor lead cannot access User Management).
 * Assumes AuthGuard has already run (user is authenticated).
 * Redirects to 404 if the current path is not allowed for the user's roles.
 */
export function RBACGuard() {
  const location = useLocation();
  const path = location.pathname;
  const systemRoleRaw = sessionStorage.getItem(SYSTEM_ROLE_KEY);
  const userRoleRaw = sessionStorage.getItem(USER_ROLE_KEY);
  const normalizedRole = normalizeSystemRole(systemRoleRaw) as SystemRole | "";

  const allowed = isPathAllowedForUserRole(path, normalizedRole, userRoleRaw ?? "");

  if (!allowed) {
    return <Navigate to={NOT_FOUND_PATH} replace />;
  }

  return <Outlet />;
}

export default RBACGuard;
