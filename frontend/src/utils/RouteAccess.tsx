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
      "/attestation_details",
      "/vendor-directory",
      "/my-vendor",
      "/security_center",
      "/governance",
      "/sales-enablement",
      "/evidence-library",
      "/product_profile",
      "/reports",
      "/user-management",
      "/vendorSelfAttestation",
    ],
      vendor: [
      "/",
      "/dashboard",
      "/assessments",
      "/vendorcots",
      "/sales-enablement",
      "/evidence-library",
      "/reports",
      "/product_profile",
      "/user-management",
      "/attestation_details",
      "/vendorSelfAttestation",
    ],
    buyer: [
      "/",
      "/dashboard",
      "/assessments",
      "/buyerAssessment",
      "/vendor-directory",
      "/my-vendor",
      "/security_center",
      "/governance",
      "/reports",
      "/user-management",
    ],
  };

  if (!bearerToken) {
    return <Navigate to="/login" replace />;
  }

  const path = location.pathname;
  let normalizedSystemRole = (systemRole ?? "").toLowerCase().trim();
  if (normalizedSystemRole === "system_admin") normalizedSystemRole = "system admin";
  const routesForRole = allowedRoutes[normalizedSystemRole] || [];

  const pathAllowed =
    routesForRole.includes(path) ||
    (path.startsWith("/reports/") && path.length > "/reports/".length) ||
    (normalizedSystemRole === "vendor" && path.startsWith("/vendorSelfAttestation/")) ||
    (normalizedSystemRole === "vendor" && path.startsWith("/vendorcots/")) ||
    (normalizedSystemRole === "buyer" && path.startsWith("/buyerAssessment/")) ||
    (normalizedSystemRole === "system admin" && (path.startsWith("/vendorcots") || path.startsWith("/buyerAssessment")));

  if (!pathAllowed) {
    return <Navigate to="/pageNotFound" replace />;
  }

  return <Outlet />;
};

export default RouteAccess;
