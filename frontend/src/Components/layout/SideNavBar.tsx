import { NAVIGATION } from "../../constants/navConfig"; // the list of side navigation bar
import { NavLink } from "react-router-dom";
import "../../styles/layout/sideNav.css";

const SideNavBar = () => {
  // const navItems = NAVIGATION["admin"];
  // console.log(navItems);

 const userRole = sessionStorage.getItem("userRole");     // "admin" | "user"
  const systemRole = sessionStorage.getItem("systemRole"); // "system admin" | "buyer" | "vendor"

  const navItems = NAVIGATION.admin.filter((item) => {
    return (
      // item.accessRoles.includes(userRole)
      item.accessRoles.includes(userRole) &&
      item.systemRoles.includes(systemRole)
    );
  });

  NAVIGATION.admin.forEach(item => {
  console.log(item.label, 
              "accessRoles:", item.accessRoles.includes(userRole), 
              "systemRoles:", item.systemRoles.includes(systemRole));
});


  return (
    <div className="side_nav_content">
      <ul className="side_nav_list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li>
              <NavLink to ={item.path} className="side_nav_link">
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
