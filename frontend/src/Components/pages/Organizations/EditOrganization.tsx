import { Ban, CircleX, Landmark, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getOrganizations } from "../../../Context/OrganizationsData";
import { toast } from "react-toastify";

const EditOrganization = ({ setIsEdit, id, orgData, allOrganizations = [] }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isError, setIsError] = useState("");
  const dispatch = useDispatch();
  const [isOrganizationName, setIsOrganizationName] = useState("");
  const [isStatus, setIsStatus] = useState("");
  const [isReason, setIsReason] = useState("");

  useEffect(() => {
    if (orgData) {
      setIsOrganizationName(orgData.organizationName);
      setIsStatus(orgData.organizationStatus);
    }
  }, [orgData]);

  const closeUpdateOrg = () => {
    setIsEdit(false);
    setIsStatus("");
    setIsReason("");
  };

  const updateOrg = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem("userId");
    if (!isOrganizationName.trim()) {
      setIsError("Organization Name is required");
      return;
    }
    if (!isStatus.trim() || isStatus === "select") {
      setIsError("Status is required");
      return;
    }
    if (!isReason.trim()) {
      setIsError("Reason is required");
      return;
    }

    const trimmedName = isOrganizationName.trim();
    const nameAlreadyExists = (allOrganizations ?? []).some(
      (org) => String(org.id) !== String(id) && (org.organizationName ?? "").trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (nameAlreadyExists) {
      setIsError("Organization already present");
      return;
    }

    if (
      orgData &&
      trimmedName === (orgData.organizationName ?? "").trim() &&
      isStatus.trim() === orgData.organizationStatus
    ) {
      setIsError("Nothing is Updated");
      return;
    }
    const data = {
      isOrganization: isOrganizationName,
      isStatus,
      isReason,
      userId,
    };

    const token = sessionStorage.getItem("bearerToken");

    try {
      const response = await fetch(`${BASE_URL}/updateOrganizations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      // console.log("response", response);
      const result = await response.json();
      // console.log(result)
      if (response.ok) {
        closeUpdateOrg();
        setIsOrganizationName("");
        toast.success("Organization updated successfully");
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
          <h2>Update Organization</h2>
          <span onClick={closeUpdateOrg}>
            <CircleX />
          </span>
        </div>
        <div className="orgDetails">
          <form action="" autoComplete="off" onSubmit={updateOrg}>
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
                onChange={(e) => {
                  setIsOrganizationName(e.target.value);
                  if (isError) setIsError("");
                }}
              />
            </div>
            <div className="orgName">
              <label htmlFor="orgname">
                <span>
                  <Landmark width={20} />
                </span>
                Status
              </label>
              <select
                name=""
                id=""
                value={isStatus}
                onChange={(e) => setIsStatus(e.target.value)}
                className={`select_input ${!isStatus || isStatus === "select" ? "select_input--placeholder" : ""}`}
              >
                <option value="select" disabled>
                  SELECT
                </option>
                <option value="active">Active</option>
                <option value="inactive">In active</option>
              </select>
              {/* {isError && <p className="orgError">{isError}</p>} */}
            </div>
            <div className="orgName">
              <label htmlFor="orgname">
                <span>
                  <Landmark width={20} />
                </span>
                Reason
              </label>
              <textarea
                style={{ resize: "none", height: "4em" }}
                type="text"
                value={isReason}
                onChange={(e) => setIsReason(e.target.value)}
              ></textarea>
              {isError && <p className="orgError">{isError}</p>}
            </div>
            <div className="orgBtns">
              <button className="orgCancelBtn" onClick={closeUpdateOrg}>
                <span>
                  <Ban width={16} />
                </span>
                Cancel
              </button>
              <button type="submit" className="orgCreateBtn">
                <span>
                  <Plus width={18} />
                </span>
                Upadate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrganization;
