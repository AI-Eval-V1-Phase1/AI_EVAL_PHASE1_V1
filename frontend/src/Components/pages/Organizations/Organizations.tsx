import React, { useState, useEffect, useCallback } from "react";
import "../../../styles/page_tabs.css";
import "./organization.css";
import "../UserManagement/user_management.css";
import "../VendorOnboarding/StepVendorOnboardingPreview.css";
import "../VendorAttestationDetails/vendor_attestation_details.css";
import CreateOrganization from "./CreateOrganization";
import OrganizationDataTable from "./OrganizationDataTable";
import StepVendorSelfAttestationPrev from "../VendorAttestations/StepVendorSelfAttestationPrev";
// import { buildFormStateFromApi } from "../../utils/vendorAttestationState";
import { buildFormStateFromApi } from "../../../utils/vendorAttestationState";
import { formatDateDDMMMYYYY } from "../../../utils/formatDate.js";
import { Landmark, Plus, User, FileCheck, ClipboardList, Eye, CircleX } from "lucide-react";
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
  const s = formatDateDDMMMYYYY(isoString);
  return s === "—" ? null : s;
}

const TAB_ONBOARDING = "onboarding";
const TAB_ATTESTATION = "attestation";

const Organizations = () => {
  document.title = "AI Eval | Organizations";
  const [isOrganization, setIsOrganization] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [previewOrg, setPreviewOrg] = useState(null);
  const [activeTab, setActiveTab] = useState(TAB_ONBOARDING);
  const [isOnboardingData, setIsOnboardingData] = useState({ buyer: null, vendor: null });
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingError, setOnboardingError] = useState(null);
  const [attestations, setAttestations] = useState([]);
  const [attestationsLoading, setAttestationsLoading] = useState(false);
  const [attestationsError, setAttestationsError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFormState, setPreviewFormState] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewAttestationId, setPreviewAttestationId] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5003/api/v1";

  const handleOpenDocument = useCallback(async (fileName) => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token || !previewAttestationId) return;
    const url = `${BASE_URL.replace(/\/$/, "")}/vendorSelfAttestation/document/${encodeURIComponent(previewAttestationId)}/${encodeURIComponent(fileName)}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const w = window.open(blobUrl, "_blank", "noopener,noreferrer");
      if (w) setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      else URL.revokeObjectURL(blobUrl);
    } catch {
      // ignore
    }
  }, [previewAttestationId, BASE_URL]);

  const createOrganization = () => {
    setIsOrganization(true);
  };

  const openPreview = async (org) => {
    if (!org) return;
    setPreviewOrg(org);
    setIsPreview(false);
    setActiveTab(TAB_ONBOARDING);
    setOnboardingError(null);
    setAttestationsError(null);
    setAttestations([]);
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

  const fetchAttestations = async (orgId) => {
    const token = sessionStorage.getItem("bearerToken");
    setAttestationsError(null);
    setAttestationsLoading(true);
    try {
      const url = `${BASE_URL.replace(/\/$/, "")}/orgAttestations/${encodeURIComponent(orgId)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch attestations");
      }
      setAttestations(result.data ?? []);
    } catch (error) {
      console.error("Attestations fetch error:", error);
      setAttestationsError(error.message || "Failed to load attestations");
      setAttestations([]);
    } finally {
      setAttestationsLoading(false);
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

  const orgIdForFetch = previewOrg ? String(previewOrg.id ?? previewOrg.organizationId ?? "").trim() : "";
  useEffect(() => {
    if (activeTab === TAB_ATTESTATION && orgIdForFetch) {
      fetchAttestations(orgIdForFetch);
    }
  }, [activeTab, orgIdForFetch]);

  const handleViewAttestation = useCallback(
    async (attestationId) => {
      if (!orgIdForFetch || !attestationId) return;
      setPreviewAttestationId(attestationId);
      setPreviewOpen(true);
      setPreviewLoading(true);
      setPreviewFormState(null);
      try {
        const token = sessionStorage.getItem("bearerToken");
        const url = `${BASE_URL.replace(/\/$/, "")}/orgAttestationPreview/${encodeURIComponent(orgIdForFetch)}/${encodeURIComponent(attestationId)}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const result = await response.json();
        if (response.ok && result.success && (result.attestation || result.companyProfile)) {
          setPreviewFormState(
            buildFormStateFromApi({
              companyProfile: result.companyProfile,
              attestation: result.attestation,
            })
          );
        }
      } catch (err) {
        console.error("Attestation preview fetch error:", err);
      } finally {
        setPreviewLoading(false);
      }
    },
    [orgIdForFetch, BASE_URL]
  );

  const formatAttestationDate = formatDateDDMMMYYYY;

  return (
    <>
      {isPreview ? (
        <div className="organizationPage sec_user_page org_settings_page">
          <div className="org_settings_header page_header_align">
            <div className="org_settings_headers page_header_row">
              <span className="icon_size_header" aria-hidden>
                <Landmark size={24} className="header_icon_svg"/>
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
        <div className="organizationPreview org_settings_page org_settings_page">
          {/* <h1 className="screenHeading">
            <span>
              <Landmark width={26} height={26} />
            </span>
            Organizations
          </h1> */}
          <Breadcrumbs
            items={[
              { label: "Organizations", onClick: closePreview },
              previewOrg?.organizationName ?? "Organization details",
            ]}
          />

          {onboardingLoading && (
            <p className="organizationPreviewEmpty">Loading…</p>
          )}
          {onboardingError && (
            <p className="organizationPreviewError">{onboardingError}</p>
          )}

          {!onboardingLoading && !onboardingError && (
            <div className="vendor_preview">
              <p className="vendor_preview_intro">
                Organization details for{" "}
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
              </div>

              {/* Tabs: Onboarding | Attestation */}
              <div className="org_preview_tabs_wrap">
                <div className="page_tabs org_preview_tabs">
                  <button
                    type="button"
                    className={`page_tab ${activeTab === TAB_ONBOARDING ? "page_tab_active" : ""}`}
                    onClick={() => setActiveTab(TAB_ONBOARDING)}
                  >
                    <ClipboardList size={18} />
                    Onboarding
                  </button>
                  <button
                    type="button"
                    className={`page_tab ${activeTab === TAB_ATTESTATION ? "page_tab_active" : ""}`}
                    onClick={() => setActiveTab(TAB_ATTESTATION)}
                  >
                    <FileCheck size={18} />
                    Attestation
                  </button>
                </div>

                {activeTab === TAB_ONBOARDING && (
                  <div className="vendor_preview_sections org_preview_tab_content">
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
                )}

                {activeTab === TAB_ATTESTATION && (
                  <div className="org_preview_tab_content org_attestations_section">
                    {attestationsLoading && (
                      <p className="organizationPreviewEmpty">Loading attestations…</p>
                    )}
                    {attestationsError && (
                      <p className="organizationPreviewError">{attestationsError}</p>
                    )}
                    {!attestationsLoading && !attestationsError && attestations.length === 0 && (
                      <p className="organizationPreviewEmpty">No attestations for this organization.</p>
                    )}
                    {!attestationsLoading && !attestationsError && attestations.length > 0 && (
                      <div className="vendor_attestation_cards org_attestation_cards">
                        {attestations.map((a) => (
                          <div key={a.id} className="vendor_attestation_card org_attestation_card">
                            <h2 className="vendor_attestation_card_title">
                              {a.product_name?.trim() || "Vendor Self-Attestation"}
                            </h2>
                            <p className="org_attestation_card_desc">
                              {a.company_description?.trim() || "No description."}
                            </p>
                            <div className="vendor_attestation_card_meta">
                              <div className="vendor_attestation_card_meta_row">
                                <span className="vendor_attestation_card_meta_label">
                                  {(a.status || "").toUpperCase() === "COMPLETED" ? "Completed by" : "Updated by"}
                                </span>
                                <span>{a.completedBy?.name?.trim() || "—"}</span>
                              </div>
                              <div className="vendor_attestation_card_meta_row">
                                <span className="vendor_attestation_card_meta_label">Status</span>
                                <span
                                  className={
                                    (a.status || "").toUpperCase() === "COMPLETED"
                                      ? "vendor_attestation_status vendor_attestation_status_completed"
                                      : "vendor_attestation_status vendor_attestation_status_draft"
                                  }
                                >
                                  {a.status || "DRAFT"}
                                </span>
                              </div>
                              <div className="vendor_attestation_card_meta_row">
                                <span className="vendor_attestation_card_meta_label">{(a.status || "").toUpperCase() === "COMPLETED" ? "Updated" : "Updated at"}</span>
                                <span>{formatAttestationDate(a.updated_at || a.created_at)}</span>
                              </div>
                            </div>
                            <div className="vendor_attestation_card_actions">
                              <button
                                type="button"
                                className="vendor_attestation_card_btn vendor_attestation_card_btn_secondary"
                                onClick={() => handleViewAttestation(a.id)}
                              >
                                <Eye size={14} />
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {previewOpen && (
            <div
              className="vendor_attestation_preview_modal_overlay"
              onClick={() => setPreviewOpen(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Escape" && setPreviewOpen(false)}
              aria-label="Close modal"
            >
              <div
                className="vendor_attestation_preview_modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="vendor_attestation_preview_modal_header">
                  <h2>Attestation Preview</h2>
                  <button
                    type="button"
                    className="modal_close_btn"
                    onClick={() => setPreviewOpen(false)}
                    aria-label="Close"
                  >
                    <CircleX size={20} />
                  </button>
                </div>
                <div className="vendor_attestation_preview_modal_body">
                  {previewLoading && (
                    <div className="vendor_attestation_loading">Loading preview…</div>
                  )}
                  {!previewLoading && previewFormState && (
                    <StepVendorSelfAttestationPrev
                      formState={previewFormState}
                      attestationId={previewAttestationId}
                      onOpenDocument={handleOpenDocument}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Organizations;
