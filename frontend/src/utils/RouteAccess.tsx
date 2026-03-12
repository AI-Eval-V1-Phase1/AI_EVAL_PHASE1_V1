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
    "system manager": [
      "/",
      "/dashboard",
      "/organizations",
      "/attestation_details",
      "/vendor-directory",
      "/assessments",
      "/vendorcots",
      "/buyerAssessment",
      "/my-vendor",
      "/product_profile",
      "/reports",
      "/user-management",
      "/vendorSelfAttestation",
    ],
    "system viewer": [
      "/",
      "/dashboard",
      "/organizations",
      "/attestation_details",
      "/vendor-directory",
      "/assessments",
      "/vendorcots",
      "/buyerAssessment",
      "/my-vendor",
      "/product_profile",
      "/reports",
      "/user-management",
      "/vendorSelfAttestation",
    ],
    "ai directory curator": [
      "/",
      "/dashboard",
      "/attestation_details",
      "/vendor-directory",
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
  if (normalizedSystemRole === "system_manager") normalizedSystemRole = "system manager";
  if (normalizedSystemRole === "system_viewer") normalizedSystemRole = "system viewer";
  if (normalizedSystemRole === "ai_directory_curator") normalizedSystemRole = "ai directory curator";
  const routesForRole = allowedRoutes[normalizedSystemRole] || [];

  // System admin has access to all pages
  const pathAllowed =
    normalizedSystemRole === "system admin" ||
    routesForRole.includes(path) ||
    (path.startsWith("/reports/") && path.length > "/reports/".length) ||
    (normalizedSystemRole === "vendor" && path.startsWith("/vendorSelfAttestation/")) ||
    (normalizedSystemRole === "vendor" && path.startsWith("/vendorcots/")) ||
    (normalizedSystemRole === "buyer" && path.startsWith("/buyerAssessment/")) ||
    (normalizedSystemRole === "system admin" && (path.startsWith("/vendorcots") || path.startsWith("/buyerAssessment"))) ||
    (normalizedSystemRole === "system manager" && (path.startsWith("/vendorcots") || path.startsWith("/buyerAssessment") || path.startsWith("/reports/"))) ||
    (normalizedSystemRole === "system viewer" && (path.startsWith("/vendorcots") || path.startsWith("/buyerAssessment") || path.startsWith("/reports/"))) ||
    (normalizedSystemRole === "ai directory curator" && path.startsWith("/vendorSelfAttestation"));

  if (!pathAllowed) {
    return <Navigate to="/pageNotFound" replace />;
  }

  return <Outlet />;
};

export default RouteAccess;
