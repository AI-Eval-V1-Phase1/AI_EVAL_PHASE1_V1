import { NAVIGATION } from "../../constants/navConfig"; // the list of side navigation bar
import { NavLink } from "react-router-dom";
import "../../styles/layout/sideNav.css";

const SideNavBar = () => {
  const userRole = (sessionStorage.getItem("userRole") ?? "").toLowerCase(); // "admin" | "user" | "system admin"
  const systemRole = (sessionStorage.getItem("systemRole") ?? "").toLowerCase(); // "system admin" | "buyer" | "vendor"

  const isSystemAdminForBoth =
    systemRole === "system admin" &&
    (userRole === "system admin" || userRole === "admin");

  const navItems = isSystemAdminForBoth
    ? NAVIGATION.admin
    : NAVIGATION.admin.filter((item) => {
        const roleMatch = item.accessRoles.some((r) => r.toLowerCase() === userRole);
        const systemMatch = item.systemRoles.some((r) => r.toLowerCase() === systemRole);
        return roleMatch && systemMatch;
      });


  return (
    <div className="side_nav_content">
      <ul className="side_nav_list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <NavLink to={item.path} className="side_nav_link">
                <span className="side_nav_icon" ><Icon size={16}/></span>
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
