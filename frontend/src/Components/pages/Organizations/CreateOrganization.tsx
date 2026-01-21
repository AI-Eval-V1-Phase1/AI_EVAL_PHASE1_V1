import { Ban, CircleX, Landmark, Plus, X } from "lucide-react";
import React from "react";

const CreateOrganization = ({ setIsOrganization }) => {
  const closeNewOrg = () => {
    setIsOrganization(false);
  };

  return (
    <div className="modal-overlay">
      <div className="newOrg">
        <div className="newOrgHeading">
          <h2>Create Organization</h2>
          <span onClick={closeNewOrg}>
            <CircleX />
          </span>
        </div>
        <div className="orgDetails">
          <form action="">
            <div className="orgName">
              <label htmlFor="orgname">
                <span><Landmark width={20} /></span>Organization Name
              </label>
              <input type="text" />
            </div>
            <div className="orgBtns">
              <button className="orgCancelBtn" onClick={closeNewOrg}>
                <span><Ban width={16} /></span>Cancel
              </button>
              <button className="orgCreateBtn"><span><Plus width={18} /></span>Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
