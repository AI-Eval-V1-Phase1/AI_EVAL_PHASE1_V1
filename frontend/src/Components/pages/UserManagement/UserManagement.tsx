import {
  UserPlus,
  Ban,
  Send,
  Mail,
  Landmark,
  UserStar,
  CircleX,
  Settings,
  Users,
  ClipboardList,
  Eye,
  Info,
} from "lucide-react";
import Button from "../../UI/Button";
import "./user_management.css";
import { useState, useEffect } from "react";
import Modal from "../../UI/Modal";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import UserDataTable from "./UserDataTable";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizations } from "../../../Context/OrganizationsData";

const ROLE_DEFINITIONS = [
  {
    title: "Org Admin",
    description: "Full access to settings, billing, and user management.",
    icon: Settings,
  },
  {
    title: "Assessor",
    description: "Can create and run assessments, view reports, and map risks.",
    icon: ClipboardList,
  },
  {
    title: "Viewer",
    description: "Read-only access to published reports and directory.",
    icon: Eye,
  },
  {
    title: "Manager",
    description: "Read-only access to published reports and directory.",
    icon: Eye,
  },
  {
    title: "Analyst",
    description: "Read-only access to published reports and directory.",
    icon: Eye,
  },
  {
    title: "User",
    description: "Read-only access to published reports and directory.",
    icon: Eye,
  },
];

const UserManagement = () => {
  useEffect(() => {
    document.title = "AI Eval | User Management Settings";
  }, []);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [activeTab, setActiveTab] = useState<"users" | "general">("users");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [userListRefreshKey, setUserListRefreshKey] = useState(0);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.organizations);

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = sessionStorage.getItem("userId");
    const userFormData = { email, organization, role, user };
    setIsInviteLoading(true);
    try {
      const token = sessionStorage.getItem("bearerToken");
      const response = await fetch(`${BASE_URL}/invite_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userFormData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("User invited successfully!");
        setIsModalOpen(false);
        setEmail("");
        setOrganization("");
        setRole("");
        setUserListRefreshKey((k) => k + 1);
      } else {
        toast.error(result.message ?? "Failed to invite user");
      }
    } catch (err) {
      console.error("Failed to invite:", err);
      toast.error("Network or server error. Please try again.");
    } finally {
      setIsInviteLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getOrganizations());
  }, [dispatch]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setOrganization("");
    setRole("");
  };

  const systemRole = (sessionStorage.getItem("systemRole") ?? "")
    .toLowerCase()
    .trim();
  const isVendorOrBuyer = systemRole === "vendor" || systemRole === "buyer";
  const userOrgName = (sessionStorage.getItem("organizationName") ?? "").trim();

  const baseOrgs = data ?? [];
  const orgsForDropdown =
    isVendorOrBuyer && userOrgName
      ? baseOrgs.filter(
          (org) => (org.organizationName ?? "").trim() === userOrgName,
        )
      : baseOrgs;

  const orgOptions = orgsForDropdown.map((org) => ({
    label: org.organizationName,
    value: org.id,
  }));

  const allRoleOptions = [
    { value: "admin", label: "Org Admin" },
    { value: "analyst", label: "Assessor" },
    { value: "manager", label: "Manager" },
    { value: "viewer", label: "Viewer" },
    { value: "user", label: "User" },
  ];
  const selectedOrg = data?.find((o) => String(o.id) === String(organization));
  const roleOptions =
    selectedOrg?.hasAdmin === true
      ? allRoleOptions.filter((r) => r.value !== "admin")
      : allRoleOptions;
  const isSystemOrgSelected = organization === "1" || organization === 1;

  const systemRoleOptions = [
    { value: "system admin", label: "System Admin" },
    { value: "system manager", label: "System Manager" },
    { value: "system viewer", label: "System Viewer" },
    { value: "system user", label: "System User" },
  ];

  return (
    <div className="sec_user_page org_settings_page">
      <div className="org_settings_header page_header_align">
        <div className="org_settings_headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <Settings size={24} className="header_icon_svg"/>
          </span>
          <div className="page_header_title_block">
            <h1 className="org_settings_title">User Management Settings</h1>
            <p className="org_settings_subtitle sub_title_card">
              Manage users and roles.
            </p>
          </div>
        </div>
      </div>

      <div className="org_settings_tabs">
        <button
          type="button"
          className={`org_settings_tab ${activeTab === "users" ? "org_settings_tab_active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={18} />
          Users & Roles
        </button>
        <button
          type="button"
          className={`org_settings_tab ${activeTab === "general" ? "org_settings_tab_active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <Info size={18} />
          General Info
        </button>
      </div>

      {activeTab === "users" && (
        <>
          <div className="org_settings_card team_members_card">
            <div className="team_members_card_header">
              <div>
                <h2 className="org_settings_card_title">Team Members</h2>
                <p className="org_settings_card_subtitle">
                  Manage access and permissions for your organization.
                </p>
              </div>
              <Button
                className="invite_user_btn org_invite_btn"
                onClick={() => setIsModalOpen(true)}
              >
                <UserPlus size={20} />
                Invite User
              </Button>
            </div>
            <div className="team_members_table_wrapper">
              <UserDataTable refreshKey={userListRefreshKey} />
            </div>
          </div>
        </>
      )}

      {activeTab === "general" && (
        <div className="org_settings_card">
          <h2 className="org_settings_card_title">General</h2>
          <p className="org_settings_card_subtitle">
            Organization name and general preferences.
          </p>
          <div className="role_definitions_section">
            <h3
              className="org_settings_card_title"
              style={{
                fontSize: "1rem",
                marginTop: "1.25rem",
                marginBottom: "0.5rem",
              }}
            >
              Role Definitions
            </h3>
            <p
              className="org_settings_card_subtitle"
              style={{ marginBottom: "1rem" }}
            >
              Permissions matrix for available roles.
            </p>
            <div className="role_definitions_grid">
              {ROLE_DEFINITIONS.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.title} className="role_definition_card">
                    <div className="role_definition_icon">
                      <Icon size={24} />
                    </div>
                    <h3 className="role_definition_title">{r.title}</h3>
                    <p className="role_definition_desc">{r.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="header_modal">
          <div>
            <h2 className="modal_popup_title">Invite New User</h2>
            <p className="modal_sub_title">
              Send an invitation email to add a new user to your organization
            </p>
          </div>
          <div className="cancel">
            <Button
              className="user_cancel_btn"
              onClick={() => setIsModalOpen(false)}
            >
              <span>
                <CircleX />
              </span>
            </Button>
          </div>
        </div>

        <form onSubmit={handleInvite} autoComplete="off">
          <div className="popup_fields">
            <Input
              labelName="Email Address"
              id="email_id"
              type="email"
              icon={<Mail width={20} height={24} />}
              name="user_email_id"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="popup_fields">
            <Select
              labelName="Organization"
              default_option="Select Organization"
              icon={<Landmark width={20} height={24} />}
              name="user_organization"
              options={orgOptions}
              value={organization}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setOrganization(e.target.value);
                setRole("");
              }}
            />
          </div>
          <div className="popup_fields">
            <Select
              labelName="Role"
              default_option="Select Role"
              icon={<UserStar width={20} height={24} />}
              name="user_role"
              options={isSystemOrgSelected ? systemRoleOptions : roleOptions}
              value={role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setRole(e.target.value)
              }
            />
          </div>
          <div className="fields_for_button_actions orgBtns">
            <Button
              onClick={() => setIsModalOpen(false)}
              onClose={handleCloseModal}
              className="orgCancelBtn"
              type="button"
            >
              <span>
                <Ban size={16} />
              </span>
              Cancel
            </Button>
            <Button
              type="submit"
              className="orgCreateBtn"
              disabled={isInviteLoading}
              aria-busy={isInviteLoading}
            >
              <span>
                <Send size={16} />
              </span>
              {isInviteLoading ? "Inviting…" : "Invite"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
