import React, { useEffect, useRef, useState } from "react";
import "../../styles/layout/topNav.css";
import { Bell, Shield } from "lucide-react";
import UserProfile from "../pages/UserProfile/UserProfile";

const TopNavBar = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const userRef = useRef(null);
  const popupRef = useRef(null);

  const handleUserPopup = () => {
    setIsPopupVisible((prev) => !prev);
  };

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        userRef.current &&
        !userRef.current.contains(event.target)
      ) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

          {/* USER SECTION */}
          <div
            className="user_icon_sec"
            onClick={handleUserPopup}
            ref={userRef}
          >
            <div className="initials">UN</div>
            <div className="name_email">
              <p className="userName">User Name</p>
              <p className="email_id">user@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {isPopupVisible && (
        <div ref={popupRef}>
          <UserProfile />
        </div>
      )}
    </>
  );
};

export default TopNavBar;
