import { LogOut, Settings, User } from "lucide-react";
import UserPopup from "../../UI/UserPopup";
import "./user_profile.css";

const UserProfile = () => {
  return (
    <>
      <UserPopup className="user_popup">
        <h5>My Account</h5>
        <ul>
          <li><span><User/></span><span>User Profile</span></li>
          <li><span><Settings/></span><span>User Settings</span></li>
          <li><span><LogOut/></span><span>Logout</span></li>
        </ul>
      </UserPopup>
    </>
  );
};

export default UserProfile;
