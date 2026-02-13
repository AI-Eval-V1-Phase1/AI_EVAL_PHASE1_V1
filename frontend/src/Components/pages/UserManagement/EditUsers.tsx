import { Ban, Send, Mail, Landmark, UserStar, CircleX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizations } from "../../../Context/OrganizationsData";
import { toast } from "react-toastify";
import Modal from "../../UI/Modal";
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import Select from "../../UI/Select";

const EditUsers = ({ isUserId, setIsEdit, isEdit, isSelectedUser }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [isReason, setIsReason] = useState("");
  const [isStatus, setIsStatus] = useState("");
  const [isError, setIsError] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setEmail("");
    setOrganization("");
    setRole("");
    setIsReason("");
    setIsStatus("");
  };

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.organizations);
  console.log(isUserId);

  useEffect(() => {
    setIsModalOpen(isEdit);
    if (isSelectedUser) {
      setEmail(isSelectedUser.email || "");
<<<<<<< HEAD
      setOrganization(String(isSelectedUser.organization_id ?? isSelectedUser.organization_name ?? ""));
=======
      setOrganization(isSelectedUser.organization_name || "");
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      setRole(isSelectedUser.role || "");
      setIsStatus(isSelectedUser.userStatus || "");
      setIsReason("");
    }
  }, [isEdit, isSelectedUser]);

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

<<<<<<< HEAD
  const orgOptions = data?.map((org) => ({
    label: org.organizationName,
    value: org.id,
  })) ?? [];
=======
  const systemOrg = "AI EVAL";

  const orgOptions = data?.map((orgOptions) => ({
    label: orgOptions.organizationName,
    value: orgOptions.id,
  }));

  orgOptions?.push({
    label: systemOrg,
    value: systemOrg,
  });
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8

  const updateUser = async (e) => {
    e.preventDefault();
    console.log("user id", isUserId);

    const userId = sessionStorage.getItem("userId");

    const data = {
      email,
      organization,
      isStatus,
      role,
      isReason,
      userId,
    };

    // const token = sessionStorage.getItem("bearerToken");
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
        console.log("Success:", result);
        toast.success("User updated successfully! ");
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

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="header_modal">
          <div>
            <h2 className="modal_popup_title">Update User</h2>
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

        <form onSubmit={updateUser} autoComplete="off">
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
              // options={roleOptions}
              options={
<<<<<<< HEAD
                organization === "1" || organization === 1 ? systemRoleOptions : roleOptions
=======
                organization === systemOrg ? systemRoleOptions : roleOptions
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
              }
              value={role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setRole(e.target.value)
              }
            />
          </div>
          <div className="popup_fields">
            <label htmlFor="orgname">
              <span>
                <Landmark width={20} />
              </span>
              Status
            </label>
            <select
              name=""
              id=""
              value={isStatus}
              onChange={(e) => setIsStatus(e.target.value)}
              className={`select_input ${!isStatus || isStatus === "select" ? "select_input--placeholder" : ""}`}
            >
              <option value="select" disabled>
                SELECT
              </option>
              <option value="active">Active</option>
              <option value="inactive">In active</option>
            </select>
            {isError && <p className="orgError">{isError}</p>}
          </div>
          <div className="popup_fields">
            <label htmlFor="orgname">
              <span>
                <Landmark width={20} />
              </span>
              Reason
            </label>
            <textarea
              style={{ resize: "none", height: "4em" , width:"100%"}}
              type="text"
              value={isReason}
              onChange={(e) => setIsReason(e.target.value)}
            ></textarea>
            {isError && <p className="orgError">{isError}</p>}
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
            <Button type="submit" className="orgCreateBtn">
              {" "}
              <span>
                <Send size={16} />
              </span>{" "}
              Update
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditUsers;
