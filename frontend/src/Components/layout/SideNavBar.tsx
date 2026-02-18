import { NAVIGATION } from "../../constants/navConfig"; // the list of side navigation bar
import { NavLink, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import "../../styles/layout/sideNav.css";

const ASSESSMENT_PATHS = ["/assessments", "/vendorcots", "/buyerAssessment"];
const isAssessmentArea = (pathname: string) => ASSESSMENT_PATHS.includes(pathname);

const isAttestationArea = (pathname: string) =>
  pathname === "/attestation_details" || pathname.startsWith("/vendorSelfAttestation");

const SideNavBar = () => {
  const location = useLocation();
  const rawUserRole = sessionStorage.getItem("userRole") ?? "";
  const rawSystemRole = sessionStorage.getItem("systemRole") ?? "";
  const userRole = String(rawUserRole).toLowerCase().trim();
  let systemRole = String(rawSystemRole).toLowerCase().trim();
  if (systemRole === "system_admin") systemRole = "system admin";
  const normalizedUserRole =
    userRole && userRole !== "null" && userRole !== "undefined" ? userRole : "";
  const normalizedSystemRole =
    systemRole && systemRole !== "null" && systemRole !== "undefined"
      ? systemRole
      : "";

  const isSystemAdminForBoth =
    normalizedSystemRole === "system admin" &&
    (normalizedUserRole === "system admin" || normalizedUserRole === "admin");

  const filterItems = (requireRole: boolean, requireSystem: boolean) =>
    NAVIGATION.admin.filter((item) => {
      const roleMatch =
        !requireRole ||
        normalizedUserRole === "" ||
        item.accessRoles.some((r) => r.toLowerCase().trim() === normalizedUserRole);
      const systemMatch =
        !requireSystem ||
        normalizedSystemRole === "" ||
        item.systemRoles.some((r) => r.toLowerCase().trim() === normalizedSystemRole);
      return roleMatch && systemMatch;
    });

  let navItems = isSystemAdminForBoth
    ? NAVIGATION.admin
    : filterItems(true, true);

  if (navItems.length === 0 && !isSystemAdminForBoth) {
    navItems = filterItems(false, true);
  }
  if (navItems.length === 0 && !isSystemAdminForBoth) {
    navItems = filterItems(true, false);
  }
  if (navItems.length === 0) {
    navItems = NAVIGATION.admin;
  }

  const seenPaths = new Set<string>();
  navItems = navItems.filter((item) => {
    if (seenPaths.has(item.path)) return false;
    seenPaths.add(item.path);
    return true;
  });

  const portalLabel =
    systemRole === "vendor"
      ? "VENDOR PORTAL"
      : systemRole === "buyer"
        ? "ORGANIZATION PORTAL"
        : null;

  const footerLabel =
    systemRole === "vendor"
      ? "MY VENDOR"
      : systemRole === "buyer"
        ? "MY BUYER"
        : "ACCOUNT";

  const displayName =
    [sessionStorage.getItem("userFirstName"), sessionStorage.getItem("userLastName")]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    (sessionStorage.getItem("userName") ?? "").trim() ||
    "User";
  const email = (sessionStorage.getItem("userEmail") ?? "").trim() || "";
  const initials = (() => {
    const first = (sessionStorage.getItem("userFirstName") ?? "").trim();
    const last = (sessionStorage.getItem("userLastName") ?? "").trim();
    if (first && last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    if (first) return first.slice(0, 2).toUpperCase();
    const un = (sessionStorage.getItem("userName") ?? "").trim();
    if (un.length >= 2) return un.slice(0, 2).toUpperCase();
    if (un.length === 1) return un.toUpperCase();
    if (email) return email.slice(0, 2).toUpperCase();
    return "UN";
  })();

  return (
    <>
      <div className="side_nav_header">
        <NavLink to="/">
          <div className="side_nav_logo_icon">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="side_nav_logo_text">AI EVAL</h3>
            <p className="side_nav_logo_tagline">Enterprise AI Governance Platform</p>
          </div>
        </NavLink>
      </div>
      <div className="side_nav_content">
      {portalLabel && (
        <p
          className="side_nav_portal_label"
          aria-label={`Portal: ${portalLabel}`}
        >
          {portalLabel}
        </p>
      )}
      <ul className="side_nav_list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isAssessmentsItem = item.path === "/assessments";
          const isAttestationItem = item.path === "/attestation_details";
          const showActive =
            (isAssessmentsItem && isAssessmentArea(location.pathname)) ||
            (isAttestationItem && isAttestationArea(location.pathname));
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  ["side_nav_link", showActive || isActive ? "active" : ""]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <span className="side_nav_icon">
                  <Icon size={18} />
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
      {/* <div className="side_nav_footer">
        <p className="side_nav_footer_label" aria-label={`Section: ${footerLabel}`}>
          {footerLabel}
        </p>
        <div className="side_nav_user_card">
          <div className="side_nav_user_avatar">{initials}</div>
          <div className="side_nav_user_info">
            <span className="side_nav_user_name">{displayName}</span>
            {email && (
              <span className="side_nav_user_email">{email}</span>
            )}
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default SideNavBar;
