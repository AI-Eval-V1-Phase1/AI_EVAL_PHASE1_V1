import { Navigate, Outlet, useLocation } from "react-router-dom";

const RouteAccess = () => {
  const location = useLocation();

  const bearerToken = sessionStorage.getItem("bearerToken");
  const systemRole = sessionStorage.getItem("systemRole"); // "admin" | "vendor" | "buyer"
  const userRole = sessionStorage.getItem("userRole"); // optional, if needed

  // Route access control
  const allowedRoutes = {
    admin: [
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
      "/my-vendor",
      "/assessments",
      "/vendor-directory",
      "/compilance",
      "/governance",
      "/sales-enablement",
      "/evidence-library",
      "/directory-listing",
      "/reports",
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
  const routesForRole = allowedRoutes[systemRole] || [];

  if (!routesForRole.includes(path)) {
    return <Navigate to="/pageNotFound" replace />;
  }

  return <Outlet />;
};

export default RouteAccess;
