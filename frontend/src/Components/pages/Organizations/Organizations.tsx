import React, { useState } from "react";
import "./organization.css";
import CreateOrganization from "./CreateOrganization";
import OrganizationDataTable from "./OrganizationDataTable";
import { Landmark, Plus } from "lucide-react";

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
          <h1 className="screenHeading"><span><Landmark width={26} height={26}/></span>Organizations</h1>
          <button className="createOrg" onClick={createOrganization}>
            <span className="createOrgImg"><Plus /></span>Organization
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
