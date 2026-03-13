import { Navigate, Outlet } from "react-router-dom";

const AUTH_TOKEN_KEY = "bearerToken";
const LOGIN_PATH = "/login";

/**
 * Route guard: requires an authenticated session (bearer token).
 * Redirects to login if not authenticated.
 */
export function AuthGuard() {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return <Navigate to={LOGIN_PATH} replace />;
  }
  return <Outlet />;
}

export default AuthGuard;
