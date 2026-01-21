import React from "react";

const CreateOrganization = ({setIsOrganization}) => {

    const closeNewOrg = ()=> {
        setIsOrganization(false)
    }

  return (
    <div className="modal-overlay">
      <div className="newOrg">
        <h2>New Organization</h2>
        <div className="orgDetails">
          <form action="">
            <div className="orgName">
              <label htmlFor="orgname"><span>*</span>Organization Name</label>
              <input type="text" />
            </div>
            <div className="orgBtns">
                <button className="orgCancelBtn" onClick={closeNewOrg}>*Cancel</button>
                <button className="orgCreateBtn">*Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
