import React, { useState } from "react";
import "./organization.css";
import CreateOrganization from "./CreateOrganization";
import OrganizationDataTable from "./OrganizationDataTable";

const Organizations = () => {
    document.title = "AI EVAL | Organizations"
  const [isOrganization, setIsOrganization] = useState(false);

  const createOrganization = () => {
    setIsOrganization(true);
  };

  return (
    <>
      <div className="organizationPage">
        <div className="organizationHeading">
          <h1>Organizations</h1>
          <button className="createOrg" onClick={createOrganization}>
            <span>*</span>Create Organization
          </button>
        </div>
        {isOrganization && (
          <CreateOrganization setIsOrganization={setIsOrganization} />
        )}
        <div>
            <OrganizationDataTable/>
        </div>
      </div>
    </>
  );
};

export default Organizations;
