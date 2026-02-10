import { NAVIGATION } from "../../constants/navConfig"; // the list of side navigation bar
import { NavLink, useLocation } from "react-router-dom";
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
        ? "BUYER PORTAL"
        : null;

  return (
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
                  <Icon size={16} />
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideNavBar;
