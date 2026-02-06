import { LogOut, LogOutIcon, Settings, User } from "lucide-react";

import UserPopup from "../../UI/UserPopup";

import "./user_profile.css";

import Button from "../../UI/Button";

import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const logout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // navigate('/login')

    const token = sessionStorage.getItem("bearerToken");
    console.log("token", token);
    console.log("BASE_URL", `${BASE_URL}/logout`);

    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (response.ok) {
        const result = await response.json();

        if (result) {
          sessionStorage.removeItem("bearerToken");

          sessionStorage.removeItem("userEmail");

          sessionStorage.removeItem("userRole");

          sessionStorage.removeItem("userId");

          sessionStorage.removeItem("systemRole");

          sessionStorage.removeItem("user_signup_completed");

          sessionStorage.removeItem("user_onboarding_completed");

          navigate("/login");
        }

        console.log(result);
      } else {
        console.log("Error: ", response.status);
      }
    } catch (err) {
      console.log("Request failed: ", err);
    }
  };

  return (
    <>
      <UserPopup className="user_popup">
        <h5>Account</h5>

        <ul>
          <li>
            <span>
              <User />
            </span>

            <span>Profile</span>
          </li>

          <li>
            <span>
              <Settings />
            </span>

            <span>Settings</span>
          </li>
        </ul>

        <Button className="logout_btn" onClick={logout}>
          <span>
            <LogOutIcon color="white" />
          </span>
          Logout
        </Button>
      </UserPopup>
    </>
  );
};

export default UserProfile;
