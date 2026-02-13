import { Mail, Building2, Shield } from "lucide-react";
import "../../styles/popovers.css";

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

interface ProfileDetailPopoverProps {
  className?: string;
}

/** Reusable profile details block: name, first/last, email, organization, role. Reads from sessionStorage. */
function ProfileDetailPopover({ className = "" }: ProfileDetailPopoverProps) {
  const userName = getSession("userName");
  const firstName = getSession("userFirstName");
  const lastName = getSession("userLastName");
  const email = getSession("userEmail");
  const organizationName = getSession("organizationName");
  const systemRole = sessionStorage.getItem("systemRole");
  const userRole = sessionStorage.getItem("userRole");
  const isVendorOrBuyer =
    systemRole && ["vendor", "buyer"].includes(systemRole.trim().toLowerCase());
  const roleLabel =
    isVendorOrBuyer && userRole?.trim()
      ? formatRoleForDisplay(userRole)
      : formatRoleForDisplay(systemRole);
  const displayName =
    userName || [firstName, lastName].filter(Boolean).join(" ") || email || "—";

  return (
    <div className={`profile_detail_popover ${className}`.trim()}>
      <div className="profile_detail_popover_row">
        <span className="profile_detail_popover_label">Name</span>
        <span className="profile_detail_popover_value">{displayName}</span>
      </div>
      {userName && (
        <div className="profile_detail_popover_row">
          <span className="profile_detail_popover_label">User name</span>
          <span className="profile_detail_popover_value">{userName}</span>
        </div>
      )}
      {firstName && (
        <div className="profile_detail_popover_row">
          <span className="profile_detail_popover_label">First name</span>
          <span className="profile_detail_popover_value">{firstName}</span>
        </div>
      )}
      {lastName && (
        <div className="profile_detail_popover_row">
          <span className="profile_detail_popover_label">Last name</span>
          <span className="profile_detail_popover_value">{lastName}</span>
        </div>
      )}
      {email && (
        <div className="profile_detail_popover_row">
          <span className="profile_detail_popover_label">
            <Mail size={12} aria-hidden /> Email
          </span>
          <span className="profile_detail_popover_value profile_detail_popover_value--email">{email}</span>
        </div>
      )}
      {organizationName && (
        <div className="profile_detail_popover_row">
          <span className="profile_detail_popover_label">
            <Building2 size={12} aria-hidden /> Organization
          </span>
          <span className="profile_detail_popover_value">{organizationName}</span>
        </div>
      )}
      <div className="profile_detail_popover_row">
        <span className="profile_detail_popover_label">
          <Shield size={12} aria-hidden /> Role
        </span>
        <span className="profile_detail_popover_value">{roleLabel}</span>
      </div>
    </div>
  );
}

export default ProfileDetailPopover;
