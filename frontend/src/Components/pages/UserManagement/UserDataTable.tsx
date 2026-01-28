import { SquarePen} from "lucide-react";
import React from "react";
import DataTable from "react-data-table-component";

const UserDataTable = () => {
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const tableData = [
    {
      id: "1",
      userName: "Test User",
      userStatus: "Active",
      userEmail: "testuser@domain.com",
      userSystemRole: "System Admin",
      userRole: "Admin",
      organization_name: "Organization 1",
    },
    {
      id: "2",
      userName: "Demo User 2",
      userStatus: "Inactive",
      userEmail: "test2@domain.com",
      userSystemRole: "System Admin",
      userRole: "Admin",
      organization_name: "Organization 2",
    },
  ];

  const filteredItems = tableData.filter(
    (item) =>
      item.userName &&
      item.userName.toLowerCase().includes(filterText.toLowerCase()),
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
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: <div className="tableHeader">Email</div>,
      selector: (row) => row.userEmail,
      sortable: true,
    },
    {
      name: <div className="tableHeader">Organization</div>,
      selector: (row) => row.organization_name,
      sortable: true,
    },
    {
      name: <div className="tableHeader">Status</div>,
      selector: (row) => (
        <p
          className={
            row.userStatus === "Active" ? "activeStatus" : "inactiveStatus"
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
      selector: (row) => row.userRole,
      sortable: true,
    },
    {
      //   name: "Actions",
      name: <div className="tableHeader">Action</div>,
      selector: (row) => (
        <div className="actionButtons">
          <p className="editOrgImg">
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
  );
};

export default UserDataTable;
