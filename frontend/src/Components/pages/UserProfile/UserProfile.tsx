import {
  LogOutIcon,
  Settings,
  User,
  Shield,
  Loader2,
  UserCircle,
} from "lucide-react";
import UserPopup from "../../UI/UserPopup";
import "./user_profile.css";
import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function formatRoleForDisplay(role: string | null): string {
  if (!role || typeof role !== "string") return "—";
  return role
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const systemRole = sessionStorage.getItem("systemRole");
  const userRole = sessionStorage.getItem("userRole");
  // For vendor/buyer show org role (e.g. Admin, Analyst) instead of user_platform_role (Vendor/Buyer)
  const isVendorOrBuyer =
    systemRole && ["vendor", "buyer"].includes(systemRole.trim().toLowerCase());
  const roleLabel =
    isVendorOrBuyer && userRole?.trim()
      ? formatRoleForDisplay(userRole)
      : formatRoleForDisplay(systemRole);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const LOGOUT_SPINNER_MIN_MS = 2500; // 2.5 seconds so spinner is visible 2–3s

  const logout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingOut(true);
    const startTime = Date.now();

    const token = sessionStorage.getItem("bearerToken");

    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
          // Keep spinner visible for at least 2–3 seconds before redirecting
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, LOGOUT_SPINNER_MIN_MS - elapsed);
          await new Promise((r) => setTimeout(r, remaining));
          navigate("/login");
          return;
        }
      }
    } catch (err) {
      console.log("Request failed: ", err);
    }

    // Ensure spinner shows for at least 2–3s before re-enabling button on error
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, LOGOUT_SPINNER_MIN_MS - elapsed);
    await new Promise((r) => setTimeout(r, remaining));
    setIsLoggingOut(false);
  };

  return (
    <>
      <UserPopup className="user_popup">
        <div className="user_popup_account_header">
          <UserCircle
            size={18}
            className="user_popup_account_icon"
            aria-hidden
          />
          <h5 className="user_popup_account_title">Account</h5>
        </div>
       
        {/* <div className="user_popup_role">
          <Shield size={14} aria-hidden />
          <span className="user_popup_role_label">Role</span>
          <span className="user_popup_role_value">{roleLabel}</span>
        </div> */}
        <ul>
          <li className="user_popup_role">
            <Shield size={14} aria-hidden />
            <span className="user_popup_role_label">Role</span>
            <span className="user_popup_role_value">{roleLabel}</span>
          </li>
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

        <Button
          className={`logout_btn ${isLoggingOut ? "auth_btn_loading" : ""}`}
          onClick={logout}
          disabled={isLoggingOut}
          aria-busy={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Loader2
                className="auth_spinner"
                size={18}
                color="white"
                aria-hidden
              />
              Logging out…
            </>
          ) : (
            <>
              <span>
                <LogOutIcon color="white" />
              </span>
              Logout
            </>
          )}
        </Button>
      </UserPopup>
    </>
  );
};

export default UserProfile;
