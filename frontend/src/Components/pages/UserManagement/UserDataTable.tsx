import { Eye, SquarePen, CircleX, Shield, Ban } from "lucide-react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizations } from "../../../Context/OrganizationsData";
import EditUsers from "./EditUsers";
import LoadingMessage from "../../UI/LoadingMessage";
import Modal from "../../UI/Modal";
import Button from "../../UI/Button";

const UserDataTable = ({ refreshKey = 0 }: { refreshKey?: number }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.organizations);
  const [isUserId, setUserId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isSelectedUser, selectedIsUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  // const tableData = [
  //   {
  //     id: "1",
  //     userName: "Test User",
  //     userStatus: "Active",
  //     userEmail: "testuser@domain.com",
  //     userSystemRole: "System Admin",
  //     userRole: "Admin",
  //     organization_name: "Organization 1",
  //   },
  //   {
  //     id: "2",
  //     userName: "Demo User 2",
  //     userStatus: "Inactive",
  //     userEmail: "test2@domain.com",
  //     userSystemRole: "System Admin",
  //     userRole: "Admin",
  //     organization_name: "Organization 2",
  //   },
  // ];
  // console.log("Organizations data:", data);

  const orgMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    (data || []).forEach((org) => {
      map[org.id] = org.organizationName;
    });
    return map;
  }, [data]);

  useEffect(() => {
    console.log("Organization map:", orgMap);
  }, [orgMap]);

  const LOADER_MIN_MS = 1500; // show loader at least 2–3 seconds

  const usersData = async () => {
    const token = sessionStorage.getItem("bearerToken");
    setLoading(true);
    const startTime = Date.now();
    try {
      const response = await fetch(`${BASE_URL}/allUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setTableData(result.data ?? []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
      await new Promise((r) => setTimeout(r, remaining));
      setLoading(false);
    }
  };

  useEffect(() => {
    usersData();
  }, [refreshKey]);

  useEffect(() => {
    // if (status == "succeeded") {
    dispatch(getOrganizations());
    // }
  }, [dispatch]);

  // const filteredItems = tableData.filter(
  //   (item) =>
  //     item.userName &&
  //     item.userName.toLowerCase().includes(filterText.toLowerCase()),
  // );

  const filteredItems = tableData.filter((item) => {
    if (!filterText.trim()) return true;
    const search = filterText.toLowerCase();
    const userName = (item.user_name ?? "").toLowerCase();
    const email = (item.email ?? "").toLowerCase();
    const orgName = (item.organization_name ?? "").toLowerCase();
    return userName.includes(search) || email.includes(search) || orgName.includes(search);
  });

  const updateUser = (row)=>{
setUserId(row.id)
setIsEdit(true)
selectedIsUser(row)
}

  //   const subHeaderComponentMemo = React.useMemo(() => {
  //     const handleClear = () => {
  //       if (filterText) {
  //         setResetPaginationToggle(!resetPaginationToggle);
  //         setFilterText("");
  //       }
  //     };
  //     return (
  //       <FilterComponent
  //         onFilter={(e) => setFilterText(e.target.value)}
  //         onClear={handleClear}
  //         filterText={filterText}
  //       />
  //     );
  //   }, [filterText, resetPaginationToggle]);

  const customStyles = {
    table: {
      style: {
        width: "100%",
        backgroundColor: "#f8f8f8",
        border: "1px solid lightgray",
      },
    },
    tableWrapper: {
      style: {
        width: "100%",
      },
    },
  };

  /** Get 2-letter initial from name or email */
  function getInitial(row: { user_name?: string; email?: string }): string {
    const name = (row.user_name ?? "").trim();
    if (name.length >= 2) return name.slice(0, 2).toUpperCase();
    if (name.length === 1) return name.toUpperCase();
    const email = (row.email ?? "").trim();
    if (email.length >= 2) return email.slice(0, 2).toUpperCase();
    return "—";
  }

  /** Display role label (capitalize, map admin -> Org Admin etc.) */
  function getRoleLabel(row: { role?: string; user_platform_role?: string }): string {
    const r = (row.role ?? row.user_platform_role ?? "").trim();
    if (!r) return "—";
    const map: Record<string, string> = {
      admin: "Org Admin",
      "system admin": "System Admin",
      analyst: "Assessor",
      viewer: "Viewer",
      user: "User",
      manager: "Manager",
    };
    return map[r.toLowerCase()] ?? r.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const columns = [
    {
      name: <div className="tableHeader">User</div>,
      selector: (row) => (row.user_name && row.user_name.trim()) ? row.user_name : row.email ?? "—",
      sortable: true,
      cell: (row) => (
        <div className="team_member_user_cell">
          <span className="team_member_initial">{getInitial(row)}</span>
          <div className="team_member_name_email">
            <span className="team_member_name">{(row.user_name && row.user_name.trim()) ? row.user_name : "—"}</span>
            <span className="team_member_email">{row.email ?? "—"}</span>
          </div>
        </div>
      ),
    },
    {
      name: <div className="tableHeader">Organization</div>,
      selector: (row) => (row.organization_name ?? "").trim() || "—",
      sortable: true,
      cell: (row) => (
        <span className="team_member_org">{(row.organization_name ?? "").trim() || "—"}</span>
      ),
    },
    {
      name: <div className="tableHeader">Role</div>,
      selector: (row) => getRoleLabel(row),
      sortable: true,
      cell: (row) => (
        <span className="pill pill_role pill_role_with_icon">
          <Shield size={14} aria-hidden />
          {getRoleLabel(row)}
        </span>
      ),
    },
    {
      name: <div className="tableHeader">Account status</div>,
      selector: (row) => (row.account_status ?? "invited").toString().toLowerCase(),
      sortable: true,
      center: true,
      cell: (row) => {
        const accountStatus = (row.account_status ?? "invited").toString().toLowerCase();
        const isConfirmed = accountStatus === "confirmed";
        return (
          <span className={`pill pill_status ${isConfirmed ? "pill_status_active" : "pill_status_pending"}`}>
            {isConfirmed ? "Confirmed" : "Invited"}
          </span>
        );
      },
    },
    {
      name: <div className="tableHeader">Status</div>,
      selector: (row) => (row.userStatus ?? "active").toString().toLowerCase(),
      sortable: true,
      center: true,
      cell: (row) => {
        const status = (row.userStatus ?? "active").toString().toLowerCase();
        const isActive = status === "active";
        return (
          <span className={`pill pill_status ${isActive ? "pill_status_active" : "pill_status_inactive"}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      name: <div className="tableHeader">Actions</div>,
      center: true,
      cell: (row) => (
        <div className="user_table_actions">
          <button
            type="button"
            className="user_table_action_btn"
            onClick={() => setViewUser(row)}
            title="View user details"
          >
            <Eye size={16} />
            View
          </button>
          <button
            type="button"
            className="user_table_action_btn"
            onClick={() => updateUser(row)}
            title="Edit user"
          >
            <SquarePen size={16} />
            Edit
          </button>
        </div>
      ),
      ignoreRowClick: true,
      minWidth: "160px",
      width: "160px",
    },
  ];

  return (
    <>
    <div className="orgDataTable">
      <div className="filterOption">
        <label htmlFor="user-search">Search</label>
        <input
          className="filterInput"
          type="text"
          id="user-search"
          placeholder="Filter by user name, email"
          aria-label="Search users"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      {loading ? (
        <LoadingMessage message="Loading users…" />
      ) : (
        <DataTable
          customStyles={customStyles}
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          selectableRows
          persistTableHead
        />
      )}
    </div>
    {isEdit && (
      <EditUsers isUserId={isUserId} setIsEdit={setIsEdit} isEdit={isEdit} isSelectedUser={isSelectedUser} />
    )}

    <Modal isOpen={!!viewUser}>
      {viewUser && (
        <div className="user_view_modal_content">
          <div className="user_view_modal_header">
            <h2 className="user_view_modal_title">User details</h2>
            <button
              type="button"
              className="user_view_modal_close_btn"
              onClick={() => setViewUser(null)}
              aria-label="Close"
            >
              <CircleX size={22} />
            </button>
          </div>
          <div className="user_view_modal_card">
            <div className="user_view_modal_row">
              <span className="user_view_modal_label">Name</span>
              <span className="user_view_modal_value">
                {(viewUser.user_name && viewUser.user_name.trim()) ? viewUser.user_name : "—"}
              </span>
            </div>
            <div className="user_view_modal_row">
              <span className="user_view_modal_label">Email</span>
              <a href={`mailto:${viewUser.email ?? ""}`} className={`user_view_modal_value user_view_modal_value_email`}>
                {viewUser.email ?? "—"}
              </a>
            </div>
            <div className="user_view_modal_row">
              <span className="user_view_modal_label">Organization</span>
              <span className="user_view_modal_value">{(viewUser.organization_name ?? "").trim() || "—"}</span>
            </div>
            <div className="user_view_modal_row">
              <span className="user_view_modal_label">Role</span>
              <span className="user_view_modal_value">{getRoleLabel(viewUser)}</span>
            </div>
            <div className="user_view_modal_row">
              <span className="user_view_modal_label">Account status</span>
              <span className="user_view_modal_value">
                {(viewUser.account_status ?? "invited").toString().toLowerCase() === "confirmed" ? "Confirmed" : "Invited"}
              </span>
            </div>
            <div className="user_view_modal_row">
              <span className="user_view_modal_label">Status</span>
              <span className="user_view_modal_value">
                {(viewUser.userStatus ?? "active").toString().toLowerCase() === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="fields_for_button_actions orgBtns user_view_modal_footer">
            <Button
              type="button"
              className="orgCancelBtn"
              onClick={() => setViewUser(null)}
            >
              <span>
                <Ban size={16} />
              </span>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Modal>
    </>
  );
};

export default UserDataTable;
