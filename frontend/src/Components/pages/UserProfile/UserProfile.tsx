import {
  LogOutIcon,
  Settings,
  User,
  Shield,
  Loader2,
  UserCircle,
  X,
} from "lucide-react";
import UserPopup from "../../UI/UserPopup";
import "../../../styles/popovers.css";
import "../VendorOnboarding/StepVendorOnboardingPreview.css";
import "./user_profile.css";
import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function getSession(key: string): string {
  const v = sessionStorage.getItem(key);
  return v != null ? String(v).trim() : "";
}

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
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const systemRole = sessionStorage.getItem("systemRole");
  const userRole = sessionStorage.getItem("userRole");
  const isVendorOrBuyer =
    systemRole && ["vendor", "buyer"].includes(systemRole.trim().toLowerCase());
  const roleLabel =
    isVendorOrBuyer && userRole?.trim()
      ? formatRoleForDisplay(userRole)
      : formatRoleForDisplay(systemRole);

  const userName = getSession("userName");
  const firstName = getSession("userFirstName");
  const lastName = getSession("userLastName");
  const email = getSession("userEmail");
  const organizationName = getSession("organizationName");
  const displayName =
    userName || [firstName, lastName].filter(Boolean).join(" ") || email || "—";

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

        <ul>
          <li className="user_popup_role">
            <Shield size={14} aria-hidden />
            <span className="user_popup_role_label">Role</span>
            <span className="user_popup_role_value">{roleLabel}</span>
          </li>
          <li
            role="button"
            tabIndex={0}
            onClick={() => setShowProfilePopup(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowProfilePopup(true);
              }
            }}
          >
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

      {showProfilePopup && (
        <div
          className="profile_modal_overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile_modal_title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowProfilePopup(false);
          }}
        >
          <div className="profile_modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="profile_modal_header">
              <h2 id="profile_modal_title" className="profile_modal_title">
              User Profile Details
              </h2>
              <button
                type="button"
                className="profile_modal_close_btn"
                onClick={() => setShowProfilePopup(false)}
                aria-label="Close profile"
              >
                <X size={20} />
              </button>
            </div>
            <div className="profile_modal_body profile_modal_preview">
              <div className="vendor_preview_sections">
                <section className="vendor_preview_card">
                  <h3 className="vendor_preview_card_title">Profile details</h3>
                  <dl className="vendor_preview_list">
                    <div className="vendor_preview_row">
                      <dt className="vendor_preview_label">Name</dt>
                      <dd className="vendor_preview_value">{displayName}</dd>
                    </div>
                    {userName && (
                      <div className="vendor_preview_row">
                        <dt className="vendor_preview_label">User name</dt>
                        <dd className="vendor_preview_value">{userName}</dd>
                      </div>
                    )}
                    {firstName && (
                      <div className="vendor_preview_row">
                        <dt className="vendor_preview_label">First name</dt>
                        <dd className="vendor_preview_value">{firstName}</dd>
                      </div>
                    )}
                    {lastName && (
                      <div className="vendor_preview_row">
                        <dt className="vendor_preview_label">Last name</dt>
                        <dd className="vendor_preview_value">{lastName}</dd>
                      </div>
                    )}
                    <div className="vendor_preview_row">
                      <dt className="vendor_preview_label">Email</dt>
                      <dd className="vendor_preview_value vendor_preview_link">{email || "—"}</dd>
                    </div>
                    {organizationName && (
                      <div className="vendor_preview_row">
                        <dt className="vendor_preview_label">Organization</dt>
                        <dd className="vendor_preview_value">{organizationName}</dd>
                      </div>
                    )}
                  </dl>
                </section>
                <section className="vendor_preview_card">
                  <h3 className="vendor_preview_card_title">Account</h3>
                  <dl className="vendor_preview_list">
                    <div className="vendor_preview_row">
                      <dt className="vendor_preview_label">Role</dt>
                      <dd className="vendor_preview_value">{roleLabel}</dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
