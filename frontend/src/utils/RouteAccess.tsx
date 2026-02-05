import { Navigate, Outlet, useLocation } from "react-router-dom";

const RouteAccess = () => {
  const location = useLocation();

  const bearerToken = sessionStorage.getItem("bearerToken");
  const systemRole = sessionStorage.getItem("systemRole"); // "admin" | "vendor" | "buyer"
  const userRole = sessionStorage.getItem("userRole"); // optional, if needed
// let system_admin = "system admin"
  // Route access control
  const allowedRoutes = {
    "system admin": [
      "/",
      "/dashboard",
      "/organizations",
      "/assessments",
      "/vendor-directory",
      "/my-vendor",
      "/compilance",
      "/governance",
      "/sales-enablement",
      "/evidence-library",
      "/directory-listing",
      "/reports",
      "/user-management"
    ],
      vendor: [
      "/",
      "/dashboard",
      "/assessments",
      "/sales-enablement",
      "/evidence-library",
      "/reports",
      "/directory-listing",
      "/user-management",
    ],
    buyer: [
      "/",
      "/dashboard",
      "/assessments",
      "/vendor-directory",
      "/my-vendor",
      "/compilance",
      "/governance",
      "/reports",
    ],
  };

  if (!bearerToken) {
    return <Navigate to="/login" replace />;
  }

  const path = location.pathname;
  const normalizedSystemRole = (systemRole ?? "").toLowerCase();
  const routesForRole = allowedRoutes[normalizedSystemRole] || allowedRoutes[systemRole] || [];

  if (!routesForRole.includes(path)) {
    return <Navigate to="/pageNotFound" replace />;
  }

  return <Outlet />;
};

export default RouteAccess;
