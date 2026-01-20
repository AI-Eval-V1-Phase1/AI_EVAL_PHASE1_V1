import { NAVIGATION } from "../../config/navConfig";
import { NavLink } from "react-router-dom";
import "../../styles/layout/sideNav.css";

const SideNavBar = () => {
  const navItems = NAVIGATION["admin"];
  console.log(navItems);
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
