import { SquarePen } from "lucide-react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizations } from "../../../Context/OrganizationsData";
import EditUsers from "./EditUsers";

const UserDataTable = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.organizations);
  const [isUserId,setUserId] = useState("")
  const [isEdit,setIsEdit] = useState(false)
  const [isSelectedUser,selectedIsUser] = useState(null)
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

  const usersData = async () => {
    const token = sessionStorage.getItem("bearerToken");

    try {
      const response = await fetch(`${BASE_URL}/allUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      // console.log(response)
      // console.log(result)
      if (response.ok) {
        // tableData(result.userData)
        const usersData = result.data;
        console.log(usersData);
        setTableData(usersData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    usersData();
  }, []);

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

  const filteredItems = tableData.filter(
    (item) =>
      item.user_name &&
      item.user_name.toLowerCase().includes(filterText.toLowerCase()),
  );

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };

  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
      <div className="filterOption">
        <label htmlFor="">Search</label>{" "}
        <input
          className="filterInput"
          name=""
          type="text"
          id="search"
          placeholder="Filter By User Name"
          aria-label="Search Input"
          value={filterText}
          onChange={onFilter}
          // autoFocus
        />
        {/* <span className="searchCondition">Search by Organization Name</span> */}
      </div>
    </>
  );

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
  };

  const columns = [
    {
      name: <div className="tableHeader">S.No</div>,
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: <div className="tableHeader">User Name</div>,
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: <div className="tableHeader">Email</div>,
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: <div className="tableHeader">Organization</div>,
      selector: (row) => orgMap[row.organization_name] || row.organization_name,
      sortable: true,
    },
    {
      name: <div className="tableHeader">Account Status</div>,
      selector: (row) => (
        <p
          style={{ textTransform: "capitalize" }}
          className={
            row.account_status === "invited" ? "inactiveStatus" : "activeStatus"
          }
        >
          {row.account_status}
        </p>
      ),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Status</div>,
      selector: (row) => (
        <p
          style={{ textTransform: "capitalize" }}
          className={
            row.userStatus === "active" ? "activeStatus" : "inactiveStatus"
          }
        >
          {row.userStatus}
        </p>
      ),
      sortable: true,
    },
    {
      name: <div className="tableHeader">System Role</div>,
      selector: (row) => row.userSystemRole,
      sortable: true,
    },
    {
      name: <div className="tableHeader">User Role</div>,
      selector: (row) => (
        <p style={{ textTransform: "capitalize" }}>{row.role}</p>
      ),
      sortable: true,
    },
    {
      //   name: "Actions",
      name: <div className="tableHeader">Action</div>,
      selector: (row) => (
        <div className="actionButtons">
          <p className="editOrgImg" onClick={()=>updateUser(row)}>
            <span>
              <SquarePen width={16} />
            </span>
            Edit
          </p>
          {/* <p className="deleteOrgImg"><span><Trash2 width={16} /></span>Delete</p> */}
        </div>
      ),
      sortable: true,
    },
  ];

  return (
    <>
    
    <div className="orgDataTable">
      {/* <div>Organization Data Table</div> */}

      {/* <DataTable columns={columns} data={filteredItems} pagination /> */}
      <DataTable
        customStyles={customStyles}
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={
          <FilterComponent
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
          />
        }
        selectableRows
        persistTableHead
      />
    </div>
    {isEdit && (
      <EditUsers isUserId={isUserId} setIsEdit={setIsEdit} isEdit={isEdit} isSelectedUser={isSelectedUser} />
    )}
    </>
  );
};

export default UserDataTable;
