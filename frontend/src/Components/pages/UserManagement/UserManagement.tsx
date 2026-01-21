import { UserPlus } from "lucide-react";
import Button from "../../UI/Button";
import Tabs from "../../UI/Tabs";
import "./user_management.css";
import { useState } from "react";
import Modal from "../../UI/Modal";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import UserDataTable from "./UserDataTable";
// import DataTable from "react-data-table-component";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="sec_user_page">
      <div className="heading_user_page">
        <div className="headers">
          <h1 >User Management</h1>
          <p className="sub_title">Manage users, roles and invitations</p>
        </div>
        <div className="btn_user_page">
          <Button
            className="invite_user_btn"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={20} />
            Invite User
          </Button>
        </div>
      </div>
      <div className="tabs_user_page">
        <Tabs></Tabs>
      </div>
      <div className="table_user_page">
        <UserDataTable />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="modal_popup_title">Invite New User</h3>
        <p className="sub_title">
          Send an invitation email to add a new user to your organization
        </p>
        <div className="popup_fields">
          <Input label="Email Address" id="email_id" type="email" />
        </div>
        <div className="popup_fields">
          <Select
            typeOfOptions="organization"
            label="Organization"
            default_option="Select Organization"
          />
        </div>
        <div className="popup_fields">
          <Select
            typeOfOptions="role"
            label="Role"
            default_option="Select Role"
          />
        </div>
        div.
      </Modal>
    </div>
  );
};

export default UserManagement;
