import { SquarePen } from "lucide-react";
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
    },
    {
      id: "2",
      organizationName: "Test Organization 2",
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
          name=""
          type="text"
          id="search"
          placeholder="Filter By Name"
          aria-label="Search Input"
          value={filterText}
          onChange={onFilter}
          // autoFocus
        />
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
      //   name: "Actions",
      name: <div className="tableHeader">Action</div>,
      selector: (row) => (
        <div className="actionButtons">
          <p className="editOrgImg"><span><SquarePen width={16} /></span>Edit</p>
          <p>Delete</p>
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
