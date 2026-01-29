import { Ban, CircleX, Landmark, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { getOrganizations } from "../../../Context/OrganizationsData";
import { useDispatch } from "react-redux";

const CreateOrganization = ({ setIsOrganization }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isOrganizationName, setIsOrganizationName] = useState("");
  const [isError, setIsError] = useState("");
  const dispatch = useDispatch(getOrganizations);
  const closeNewOrg = () => {
    setIsOrganization(false);
    setIsError("");
  };

  const createOrg = async (e) => {
    e.preventDefault();

    if (isOrganizationName == "") {
      setIsError("Organization Feild is required");
      return;
    }

    const orgData = { isOrganizationName };

    // console.log(orgData);

    try {
      const response = await fetch(`${BASE_URL}/newOrganization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orgData),
      });
      // console.log("response", response);
      const result = await response.json();
      // console.log(result)
      if (response.ok) {
        // console.log(result);
        // setIsContact(false);
        closeNewOrg();
        setIsOrganizationName("");
        toast.success("Organization created successfully");
        dispatch(getOrganizations());
        setIsError("");
      } else {
        // setIsEmail(result.message)
        console.log("response", result.message);
        setIsError(result.message);
      }
    } catch (error) {
      console.log(error);
    }
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
          <form action="" autoComplete="off" onSubmit={createOrg}>
            <div className="orgName">
              <label htmlFor="orgname">
                <span>
                  <Landmark width={20} />
                </span>
                Organization Name
              </label>
              <input
                type="text"
                value={isOrganizationName}
                onChange={(e) => setIsOrganizationName(e.target.value)}
              />
              {isError && <p className="orgError">{isError}</p>}
            </div>
            <div className="orgBtns">
              <button className="orgCancelBtn" onClick={closeNewOrg}>
                <span>
                  <Ban width={16} />
                </span>
                Cancel
              </button>
              <button type="submit" className="orgCreateBtn">
                <span>
                  <Plus width={18} />
                </span>
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
