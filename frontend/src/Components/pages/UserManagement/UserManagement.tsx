import {
  UserCog,
  UserPlus,
  Ban,
  Send,
  Mail,
  Landmark,
  UserStar,
  CircleX,
} from "lucide-react";
import Button from "../../UI/Button";
// import Tabs from "../../UI/Tabs";
import "./user_management.css";
import { useState } from "react";
import Modal from "../../UI/Modal";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import UserDataTable from "./UserDataTable";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizations } from "../../../Context/OrganizationsData";
// import DataTable from "react-data-table-component";

const UserManagement = () => {
  useEffect(() => {
    document.title = "AI Eval | User Management";
  }, []);

  const BASE_URL = import.meta.env.VITE_BASE_URL;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
const dispatch = useDispatch()
  const {data} = useSelector(state=>state.organizations)
console.log("data of orgs",data)
  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userFormData = { email, organization, role };
    console.log("Submitting form with:", userFormData); // 🔹 add this

    try {
      const response = await fetch(
        `${BASE_URL}/invite_user`, // matches backend
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userFormData),
        },
      );
      const result = await response.json();
      if (response.ok) {
        console.log("Success:", result);
        toast.success("User invited successfully! ");
        setIsModalOpen(false);
        setEmail("");
        setOrganization("");
        setRole("");
      } else {
        console.error("Server error:", result.message);
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Failed to parse JSON:", err);
    }
  };

    useEffect(() => {
      // if (status == "succeeded") {
        dispatch(getOrganizations());
      // }
    }, [dispatch]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setOrganization("");
    setRole("");
  };

  // const orgOptions = [
  //   { value: "Organization 1", label: "Organization 1" },
  //   { value: "Organization 2", label: "Organization 2" },
  // ];


  // const orgOptions = data

 const orgOptions = data.map(
    (orgOptions) => ({
      label: orgOptions.organizationName,
      value: orgOptions.id,
    }),
  );

  // console.log(data)

  const roleOptions = [
    { value: "admin", label: "admin" },
    { value: "system admin", label: "system admin" },
    { value: "analyst", label: "Analyst" },
    { value: "manager", label: "manager" },
    { value: "viewer", label: "viewer" },
    { value: "user", label: "user" },
  ];

  return (
    <div className="sec_user_page">
      <div className="heading_user_page">
        <div className="headers">
          <h1>
            <span>
              <UserCog width={28} height={28} />
            </span>
            User Management
          </h1>
          <p className="sub_title">Manage users, roles and invitations</p>
        </div>
        <div className="btn_user_page">
          <Button
            className="invite_user_btn"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={24} />
            Invite User
          </Button>
        </div>
      </div>
      {/* <div className="tabs_user_page">
        <Tabs></Tabs>
      </div> */}
      <div className="table_user_page">
        <UserDataTable />
      </div>
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOrganization(e.target.value)
              }
            />
          </div>
          <div className="popup_fields">
            <Select
              labelName="Role"
              default_option="Select Role"
              icon={<UserStar width={20} height={24} />}
              name="user_role"
              options={roleOptions}
              value={role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setRole(e.target.value)
              }
            />
          </div>
          <div className="fields_for_button_actions orgBtns">
            <Button
              onClick={() => setIsModalOpen(false)}
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
              Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
