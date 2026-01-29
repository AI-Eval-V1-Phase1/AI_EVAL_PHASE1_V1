import React, { useState } from "react";
import "../../styles/layout/topNav.css";
import { Bell, Shield } from "lucide-react";
// import UserPopup from "../UI/UserPopup";
// import UserProfile from "../pages/UserProfile/UserProfile";
const TopNavBar = () => {
  // const [isPopupVisible, setIsPopupVisible] = useState(true);
  const handleUserPopup = () => {};
  return (
    <>
      <div className="top_nav_content">
        <div className="nav_left_content">
          <div className="logo_sec">
            <Shield className="logo_img" size={40} />
          </div>
          <div className="logo_name">
            <h3>AI EVAL</h3>
            <p>Enterprise AI Governance Platform</p>
          </div>
        </div>
        <div className="nav_right_content">
          <div className="notifications_icon_sec">
            <Bell size={24} className="notification_icon" />
          </div>
          <div className="user_icon_sec">
            <div className="initials" onClick={handleUserPopup}>
              UN
            </div>
            <div className="name_email">
              <p className="userName">User Name</p>
              <p className="email_id">user@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      
      {/* <UserProfile/> */}
    </>
  );
};

export default TopNavBar;
