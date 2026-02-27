import { Ban, CircleArrowUp, Mail, Landmark, UserStar, CircleX, Shield, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizations } from "../../../Context/OrganizationsData";
import { toast } from "react-toastify";
import Button from "../../UI/Button";
import "../UserProfile/user_profile.css";
import "../../../styles/popovers.css";

const EditUsers = ({ isUserId, setIsEdit, isEdit, isSelectedUser }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [isReason, setIsReason] = useState("");
  const [isStatus, setIsStatus] = useState("");
  const [isError, setIsError] = useState("");
  const [fetchingUser, setFetchingUser] = useState(false);
  const [initialRole, setInitialRole] = useState("");
  const [initialStatus, setInitialStatus] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setEmail("");
    setOrganization("");
    setRole("");
    setIsReason("");
    setIsStatus("");
    setInitialRole("");
    setInitialStatus("");
    setIsError("");
  };

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.organizations);

  useEffect(() => {
    setIsModalOpen(isEdit);
    if (!isEdit) return;
    // Prefill from props immediately, then fetch fresh data
    if (isSelectedUser) {
      const r = isSelectedUser.role || isSelectedUser.user_platform_role || "";
      const s = isSelectedUser.userStatus || "";
      setEmail(isSelectedUser.email || "");
      setOrganization(String(isSelectedUser.organization_id ?? isSelectedUser.organization_name ?? ""));
      setRole(r);
      setIsStatus(s);
      setInitialRole(r);
      setInitialStatus(s);
      setIsReason("");
    }
    if (!isUserId) return;
    setFetchingUser(true);
    const token = sessionStorage.getItem("bearerToken");
    fetch(`${BASE_URL}/allUsers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const list = result?.data ?? [];
        const user = list.find((u) => String(u.id) === String(isUserId));
        if (user) {
          const r = user.role || user.user_platform_role || "";
          const s = user.userStatus || "";
          setEmail(user.email || "");
          setOrganization(String(user.organization_id ?? user.organization_name ?? ""));
          setRole(r);
          setIsStatus(s);
          setInitialRole(r);
          setInitialStatus(s);
          setIsReason("");
        }
      })
      .catch(() => {})
      .finally(() => setFetchingUser(false));
  }, [isEdit, isUserId]);

  useEffect(() => {
    // if (status == "succeeded") {
    dispatch(getOrganizations());
    // }
  }, [dispatch]);

  const roleOptions = [
    { value: "admin", label: "admin" },
    // { value: "system admin", label: "system admin" },
    { value: "analyst", label: "Analyst" },
    { value: "manager", label: "manager" },
    { value: "viewer", label: "viewer" },
    { value: "user", label: "user" },
  ];
  const systemRoleOptions = [
    { value: "system admin", label: "system admin" },
    { value: "system manager", label: "system manager" },
    { value: "system viewer", label: "system viewer" },
    { value: "system user", label: "system user" },
  ];

  const orgOptions = data?.map((org) => ({
    label: org.organizationName,
    value: org.id,
  })) ?? [];

  const updateUser = async (e) => {
    e.preventDefault();
    setIsError("");

    const roleChanged = String(role ?? "").trim().toLowerCase() !== String(initialRole ?? "").trim().toLowerCase();
    const statusChanged = String(isStatus ?? "").trim().toLowerCase() !== String(initialStatus ?? "").trim().toLowerCase();
    const hasChange = roleChanged || statusChanged;

    if (!hasChange) {
      setIsError("No changes");
      return;
    }
    if (!isReason || !String(isReason).trim()) {
      setIsError("Reason is required when making changes");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    const data = {
      email,
      organization,
      isStatus,
      role,
      isReason: String(isReason).trim(),
      userId,
    };

    try {
      const token = sessionStorage.getItem("bearerToken");
      const response = await fetch(
        `${BASE_URL}/updateUser/${isUserId}`, // matches backend
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      if (response.ok) {
        toast.success("User updated successfully! ");
        setIsError("");
        setIsModalOpen(false);
        setEmail("");
        setOrganization("");
        setIsReason("");
        setRole("");
      } else {
        console.error("Server error:", result.message);
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Failed to parse JSON:", err);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="profile_modal_overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update_user_modal_title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseModal();
      }}
    >
      <div className="profile_modal_content settings_modal_content" onClick={(e) => e.stopPropagation()}>
        <div className="profile_modal_header">
          <h2 id="update_user_modal_title" className="profile_modal_title">
            Update User
          </h2>
          <button
            type="button"
            className="modal_close_btn"
            onClick={handleCloseModal}
            aria-label="Close"
          >
            <CircleX size={20} />
          </button>
        </div>
        <div className="profile_modal_body">
          <form onSubmit={updateUser} className="settings_form" autoComplete="off">
            <div className="settings_form_row">
              <div className="settings_form_group">
                <label htmlFor="edit_user_email">
                  <Mail size={16} aria-hidden />
                  Email Address
                </label>
                <input
                  id="edit_user_email"
                  type="email"
                  className="settings_input settings_input_readonly"
                  name="user_email_id"
                  value={email}
                  readOnly
                  aria-readonly="true"
                  title="Email cannot be changed"
                />
              </div>
              <div className="settings_form_group">
                <label htmlFor="edit_user_organization">
                  <Landmark size={16} aria-hidden />
                  Organization
                </label>
                <select
                  id="edit_user_organization"
                  name="user_organization"
                  className="settings_input"
                  value={organization}
                  disabled
                  aria-readonly="true"
                  title="Organization cannot be changed"
                >
                  <option value="">Select Organization</option>
                  {orgOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="settings_form_row">
              <div className="settings_form_group">
                <label htmlFor="edit_user_role">
                  <UserStar size={16} aria-hidden />
                  Role
                </label>
                <select
                  id="edit_user_role"
                  name="user_role"
                  className="settings_input settings_input_cursor_pointer"
                  value={role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  {(organization === "1" || organization === 1 ? systemRoleOptions : roleOptions).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="settings_form_group">
                <label htmlFor="edit_user_status">
                  <Shield size={16} aria-hidden />
                  Status
                </label>
                <select
                  id="edit_user_status"
                  name="user_status"
                  className="settings_input settings_input_cursor_pointer"
                  value={isStatus}
                  onChange={(e) => setIsStatus(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="settings_form_row">
              <div className="settings_form_group" style={{ flex: "1 1 100%" }}>
                <label htmlFor="edit_user_reason">
                  <FileText size={16} aria-hidden />
                  Reason
                </label>
                <textarea
                  id="edit_user_reason"
                  name="user_reason"
                  className="settings_input"
                  value={isReason}
                  onChange={(e) => setIsReason(e.target.value)}
                  rows={3}
                  style={{ resize: "vertical", minHeight: "4em" }}
                />
              </div>
            </div>
            {isError && <p className="settings_error">{isError}</p>}
            <div className="settings_form_actions">
              <Button type="button" className="orgCancelBtn" onClick={handleCloseModal}>
                <Ban size={16} aria-hidden />
                Cancel
              </Button>
              <Button type="submit" className="orgCreateBtn">
                <CircleArrowUp size={16} aria-hidden />
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUsers;
