import { SquarePen, Trash, Trash2 } from "lucide-react";
import React from "react";
import DataTable from "react-data-table-component";

const OrganizationDataTable = () => {
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const tableData = [
    {
      id: "1",
      organizationName: "Test Organization",
      orgStatus: "Active",
    },
    {
      id: "2",
      organizationName: "Test Organization 2",
      orgStatus: "Inactive",
    },
  ];

  const filteredItems = tableData.filter(
    (item) =>
      item.organizationName &&
      item.organizationName.toLowerCase().includes(filterText.toLowerCase()),
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
          placeholder="Filter By Organization"
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
      name: <div className="tableHeader">Organization Name</div>,
      selector: (row) => row.organizationName,
      sortable: true,
    },
    {
      name: <div className="tableHeader">Status</div>,
      selector: (row) => (
        <p
          className={
            row.orgStatus === "Active" ? "activeStatus" : "inactiveStatus"
          }
        >
          {row.orgStatus}
        </p>
      ),
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

export default OrganizationDataTable;
