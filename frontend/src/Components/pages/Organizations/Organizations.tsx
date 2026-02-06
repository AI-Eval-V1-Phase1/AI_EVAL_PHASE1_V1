import React, { useState } from "react";
import "./organization.css";
import CreateOrganization from "./CreateOrganization";
import OrganizationDataTable from "./OrganizationDataTable";
import { Landmark, Plus } from "lucide-react";
import PreviewTable from "../../preview/PreviewTable";
import Breadcrumbs from "../../UI/Breadcrumbs";

const Organizations = () => {
  document.title = "AI EVAL | Organizations";
  const [isOrganization, setIsOrganization] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [previewOrg, setPreviewOrg] = useState(null);
  const [isOnboardingData, setIsOnboardingData] = useState({ buyer: null, vendor: null });
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingError, setOnboardingError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5003/api/v1";

  const createOrganization = () => {
    setIsOrganization(true);
  };

  const openPreview = async (org) => {
    if (!org) return;
    setPreviewOrg(org);
    setIsPreview(false);
    setOnboardingError(null);
    setOnboardingLoading(true);
    setIsOnboardingData({ buyer: null, vendor: null });
    const orgId = String(org.id ?? org.organizationId ?? "").trim();
    if (!orgId) {
      setOnboardingError("Organization ID is missing.");
      setOnboardingLoading(false);
      return;
    }
    const onboardingData = await fetchOnboardingData(orgId);
    setOnboardingLoading(false);
    setIsOnboardingData(onboardingData || { buyer: null, vendor: null });
  };

  const closePreview = () => {
    setPreviewOrg(null);
    setIsPreview(true);
  };

  const fetchOnboardingData = async (orgId) => {
    const token = sessionStorage.getItem("bearerToken");
    try {
      const url = `${BASE_URL.replace(/\/$/, "")}/orgOnboarding/${encodeURIComponent(orgId)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch onboarding data");
      }

      return result.data ?? { buyer: null, vendor: null };
    } catch (error) {
      console.error("Onboarding fetch error:", error);
      setOnboardingError(error.message || "Failed to load onboarding data");
      return { buyer: null, vendor: null };
    }
  };

  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .replace(/_/g, " ")
      .trim();

  const buildOnboardingFields = (data) => {
    if (!data || typeof data !== "object") return [];
    return Object.keys(data)
      .filter(
        (k) =>
          !["id", "createdAt", "updatedAt", "userId", "organizationId"].includes(k)
      )
      .map((key) => ({
        label: formatLabel(key),
        value: (obj) => obj[key],
      }));
  };

  return (
    <>
      {isPreview ? (
        <div className="organizationPage">
          <div className="organizationHeading">
            <h1 className="screenHeading">
              <span>
                <Landmark width={26} height={26} />
              </span>
              Organizations
            </h1>
            <button className="createOrg" onClick={createOrganization}>
              <span className="createOrgImg">
                <Plus />
              </span>
              Organization
            </button>
          </div>
          {isOrganization && (
            <CreateOrganization setIsOrganization={setIsOrganization} />
          )}
          <div>
            <OrganizationDataTable openPreview={openPreview} />
          </div>
        </div>
      ) : (
        <div className="organizationPreview">
          <h1 className="screenHeading" onClick={closePreview} style={{ cursor: "pointer" }}>
            <span>
              <Landmark width={26} height={26} />
            </span>
            Organizations
          </h1>
          <Breadcrumbs items={[previewOrg?.organizationName]} />
          <PreviewTable
            dataForPreview={previewOrg}
            previewFields={[
              { label: "Organization Name", value: (org) => org?.organizationName },
              { label: "Status", value: (org) => org?.organizationStatus },
            ]}
            previewTitle={`Organization: ${previewOrg?.organizationName}`}
          />
          {isOnboardingData?.buyer && (
            <PreviewTable
              dataForPreview={isOnboardingData.buyer}
              previewFields={buildOnboardingFields(isOnboardingData.buyer)}
              previewTitle="Buyer Onboarding"
            />
          )}
          {isOnboardingData?.vendor && (
            <PreviewTable
              dataForPreview={isOnboardingData.vendor}
              previewFields={buildOnboardingFields(isOnboardingData.vendor)}
              previewTitle="Vendor Onboarding"
            />
          )}
          {onboardingLoading && (
            <p className="organizationPreviewEmpty">Loading onboarding data...</p>
          )}
          {onboardingError && (
            <p className="organizationPreviewError" style={{ color: "#c00", marginTop: 8 }}>
              {onboardingError}
            </p>
          )}
          {!onboardingLoading && !isOnboardingData?.buyer && !isOnboardingData?.vendor && !onboardingError && (
            <p className="organizationPreviewEmpty">No onboarding data for this organization yet.</p>
          )}
        </div>
      )}
    </>
  );
};

export default Organizations;
