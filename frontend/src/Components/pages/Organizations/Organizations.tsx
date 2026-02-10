import React, { useState } from "react";
import "./organization.css";
import "../UserManagement/user_management.css";
import "../VendorOnboarding/StepVendorOnboardingPreview.css";
import CreateOrganization from "./CreateOrganization";
import OrganizationDataTable from "./OrganizationDataTable";
import { Landmark, Plus, User } from "lucide-react";
import Button from "../../UI/Button";
import Breadcrumbs from "../../UI/Breadcrumbs";

/** Format sector object to readable string for preview */
function formatSectorForPreview(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const sectorMap = {
    "Public Sector": value.public_sector,
    "Private Sector": value.private_sector,
    "Non-Profit Sector": value.non_profit_sector,
  };
  const parts = [];
  Object.entries(sectorMap).forEach(([label, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      parts.push(`${label}: ${values.join(", ")}`);
    }
  });
  return parts.length > 0 ? parts.join("; ") : null;
}

function formatPreviewValue(value, label) {
  if (value === null || value === undefined || value === "") {
    return <span className="vendor_preview_na">—</span>;
  }
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : <span className="vendor_preview_na">—</span>;
  }
  if (typeof value === "object") {
    const sectorText = formatSectorForPreview(value);
    if (sectorText !== null) {
      return sectorText;
    }
    return (
      <ul className="vendor_preview_nested_list">
        {Object.entries(value).map(([k, vals]) => (
          <li key={k}>
            <span className="vendor_preview_nested_label">{k}:</span>{" "}
            {Array.isArray(vals) ? vals.join(", ") : String(vals)}
          </li>
        ))}
      </ul>
    );
  }
  let str = String(value);
  if (str === "[object Object]") {
    return <span className="vendor_preview_na">—</span>;
  }
  if (label?.toLowerCase().includes("sector") && str.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(str);
      const sectorText = formatSectorForPreview(parsed);
      if (sectorText !== null) return sectorText;
    } catch {
      /* use str as-is */
    }
  }
  if (label?.toLowerCase().includes("email")) {
    return (
      <a href={`mailto:${str}`} className="vendor_preview_link">
        {str}
      </a>
    );
  }
  if (label?.toLowerCase().includes("website")) {
    const href = str.startsWith("http") ? str : `https://${str}`;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="vendor_preview_link">
        {str}
      </a>
    );
  }
  return str;
}

function formatOnboardingDate(isoString) {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

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

  const SKIP_ONBOARDING_KEYS = [
    "id",
    "createdAt",
    "updatedAt",
    "userId",
    "organizationId",
    "completedBy",
    "completedAt",
  ];

  const buildOnboardingFields = (data) => {
    if (!data || typeof data !== "object") return [];
    return Object.keys(data)
      .filter((k) => !SKIP_ONBOARDING_KEYS.includes(k))
      .map((key) => ({
        label: formatLabel(key),
        value: (obj) => obj[key],
      }));
  };

  return (
    <>
      {isPreview ? (
        <div className="organizationPage sec_user_page org_settings_page">
          <div className="org_settings_header page_header_align">
            <div className="org_settings_headers page_header_row">
              <span className="icon_size_header" aria-hidden>
                <Landmark size={24} />
              </span>
              <div className="page_header_title_block">
                <h1 className="org_settings_title page_header_title">Organizations</h1>
                <p className="org_settings_subtitle page_header_subtitle">Manage organizations and onboarding.</p>
              </div>
            </div>
          </div>

          {isOrganization && (
            <CreateOrganization setIsOrganization={setIsOrganization} />
          )}

          <div className="org_settings_card team_members_card">
            <div className="team_members_card_header">
              <div>
                <h2 className="org_settings_card_title">Organizations</h2>
                <p className="org_settings_card_subtitle">View and manage organizations, status, and onboarding.</p>
              </div>
              <Button
                className="invite_user_btn org_invite_btn"
                onClick={createOrganization}
              >
                <Plus size={20} />
                Add Organization
              </Button>
            </div>
            <div className="team_members_table_wrapper">
              <OrganizationDataTable openPreview={openPreview} />
            </div>
          </div>
        </div>
      ) : (
        <div className="organizationPreview">
          <h1 className="screenHeading">
            <span>
              <Landmark width={26} height={26} />
            </span>
            Organizations
          </h1>
          <Breadcrumbs
            items={[
              { label: "Organizations", onClick: closePreview },
              previewOrg?.organizationName ?? "Organization details",
            ]}
          />

          {onboardingLoading && (
            <p className="organizationPreviewEmpty">Loading onboarding data…</p>
          )}
          {onboardingError && (
            <p className="organizationPreviewError">{onboardingError}</p>
          )}

          {!onboardingLoading && !onboardingError && (
            <div className="vendor_preview">
              <p className="vendor_preview_intro">
                Organization and onboarding details for{" "}
                <strong>{previewOrg?.organizationName ?? "this organization"}</strong>.
              </p>
              <div className="vendor_preview_sections">
                {/* Organization summary card */}
                <section className="vendor_preview_card">
                  <h3 className="vendor_preview_card_title">
                    <Landmark size={18} style={{ verticalAlign: "middle", marginRight: "0.35rem" }} />
                    Organization
                  </h3>
                  <dl className="vendor_preview_list">
                    <div className="vendor_preview_row">
                      <dt className="vendor_preview_label">Organization name</dt>
                      <dd className="vendor_preview_value">
                        {previewOrg?.organizationName ?? "—"}
                      </dd>
                    </div>
                    <div className="vendor_preview_row">
                      <dt className="vendor_preview_label">Status</dt>
                      <dd className="vendor_preview_value">
                        <span
                          className={
                            previewOrg?.organizationStatus === "active"
                              ? "activeStatus"
                              : "inactiveStatus"
                          }
                        >
                          {previewOrg?.organizationStatus ?? "—"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </section>

                {/* Buyer Onboarding card */}
                <section className="vendor_preview_card">
                  <h3 className="vendor_preview_card_title">Buyer Onboarding</h3>
                  {isOnboardingData?.buyer ? (
                    <>
                      <div className="org_preview_completed_by">
                        <User size={16} />
                        <span>
                          Completed by{" "}
                          <strong>
                            {isOnboardingData.buyer.completedBy?.name ||
                              isOnboardingData.buyer.completedBy?.email ||
                              "—"}
                          </strong>
                          {isOnboardingData.buyer.completedAt &&
                            formatOnboardingDate(isOnboardingData.buyer.completedAt) && (
                              <> on {formatOnboardingDate(isOnboardingData.buyer.completedAt)}</>
                            )}
                        </span>
                      </div>
                      <dl className="vendor_preview_list">
                        {buildOnboardingFields(isOnboardingData.buyer).map((field) => (
                          <div key={field.label} className="vendor_preview_row">
                            <dt className="vendor_preview_label">{field.label}</dt>
                            <dd className="vendor_preview_value">
                              {formatPreviewValue(
                                field.value(isOnboardingData.buyer),
                                field.label,
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  ) : (
                    <p className="vendor_preview_not_done">Not completed for this organization.</p>
                  )}
                </section>

                {/* Vendor Onboarding card */}
                <section className="vendor_preview_card">
                  <h3 className="vendor_preview_card_title">Vendor Onboarding</h3>
                  {isOnboardingData?.vendor ? (
                    <>
                      <div className="org_preview_completed_by">
                        <User size={16} />
                        <span>
                          Completed by{" "}
                          <strong>
                            {isOnboardingData.vendor.completedBy?.name ||
                              isOnboardingData.vendor.completedBy?.email ||
                              "—"}
                          </strong>
                          {isOnboardingData.vendor.completedAt &&
                            formatOnboardingDate(isOnboardingData.vendor.completedAt) && (
                              <> on {formatOnboardingDate(isOnboardingData.vendor.completedAt)}</>
                            )}
                        </span>
                      </div>
                      <dl className="vendor_preview_list">
                        {buildOnboardingFields(isOnboardingData.vendor).map((field) => (
                          <div key={field.label} className="vendor_preview_row">
                            <dt className="vendor_preview_label">{field.label}</dt>
                            <dd className="vendor_preview_value">
                              {formatPreviewValue(
                                field.value(isOnboardingData.vendor),
                                field.label,
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  ) : (
                    <p className="vendor_preview_not_done">Not completed for this organization.</p>
                  )}
                </section>

                {!isOnboardingData?.buyer && !isOnboardingData?.vendor && (
                  <p className="organizationPreviewEmpty">
                    No onboarding data for this organization yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Organizations;
