import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ClipboardList, Eye, CircleX, Check, Trash2, Pencil } from "lucide-react";
import DataTable from "react-data-table-component";
import Button from "../../UI/Button";
import Modal from "../../UI/Modal";
import LoadingMessage from "../../UI/LoadingMessage";
import PreviewTable from "../../preview/PreviewTable";
import type { PreviewField } from "../../../types/preview";
import { BUYER_COTS_FIELD_KEYS } from "../../../constants/buyerCotsAssessmentKeys";
import "../Organizations/organization.css";
import "../UserManagement/user_management.css";
import "../../preview/preview_table.css";
import "./assessments.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/** Keys from list API that count toward progress (cots_buyer fields) */
const BUYER_COTS_PROGRESS_KEYS = [
  "businessPainPoint", "expectedOutcomes", "owningDepartment", "budgetRange", "targetTimeline", "criticality",
  "vendorName", "productName", "requirementGaps", "integrationSystems", "techStack", "digitalMaturityLevel",
  "dataGovernanceMaturity", "aiGovernanceBoard", "aiEthicsPolicy", "implementationTeamComposition",
  "dataSensitivity", "regulatoryRequirements", "riskAppetite", "decisionStakes", "impactedStakeholders",
  "vendorValidationApproach", "vendorSecurityPosture", "vendorCertifications", "pilotRolloutPlan",
  "rollbackCapability", "changeManagementPlan", "monitoringDataAvailable", "auditLogsAvailable",
  "testingResultsAvailable", "identifiedRisks", "riskDomainScores", "contextualMultipliers", "riskMitigation",
];

function getBuyerAssessmentProgress(row) {
  if (!row || row.type !== "cots_buyer") return 0;
  let filled = 0;
  for (const key of BUYER_COTS_PROGRESS_KEYS) {
    const v = row[key];
    if (v != null && v !== "") {
      if (typeof v === "string" && v.trim() !== "") filled++;
      else if (Array.isArray(v) && v.length > 0) filled++;
      else if (typeof v === "object") filled++;
    }
  }
  return Math.round((filled / BUYER_COTS_PROGRESS_KEYS.length) * 100);
}

const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? String(d) : date.toLocaleDateString(undefined, { dateStyle: "short" });
};

const truncate = (str, max = 40) => {
  if (str == null || str === "") return "—";
  const s = String(str);
  return s.length <= max ? s : `${s.slice(0, max)}…`;
};

/** Get display value from assessment row (API shape: camelCase, arrays for jsonb) */
function getRowPreviewValue(row, key) {
  const v = row[key];
  if (v == null || (typeof v === "string" && v.trim() === "")) return undefined;
  if (key === "createdAt" || key === "cotsUpdatedAt") return formatDate(v);
  return v;
}

/** Format sector for preview: object -> readable string; "[object Object]" -> N/A */
function formatSectorForPreview(value) {
  if (value == null || value === "") return undefined;
  if (typeof value === "string") {
    if (value === "[object Object]") return "N/A";
    return value;
  }
  if (typeof value !== "object" || Array.isArray(value)) return value;
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
  return parts.length > 0 ? parts.join("; ") : "N/A";
}

/** Sectioned preview config for assessment row - same structure as COTS form preview */
const ASSESSMENT_PREVIEW_SECTIONS = [
  {
    title: "Assessment",
    fields: [
      { label: "Type", value: (r) => (r.type === "cots_buyer" ? "COTS Assessment" : r.type === "cots_vendor" ? "COTS Vendor" : (r.type ?? undefined)) },
      { label: "Status", value: (r) => r.status ?? undefined },
      { label: "Created", value: (r) => formatDate(r.createdAt) },
    ],
  },
  {
    title: "Use Case",
    fields: BUYER_COTS_FIELD_KEYS.useCase.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Vendor Evaluation",
    fields: BUYER_COTS_FIELD_KEYS.vendorEvaluation.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Readiness",
    fields: BUYER_COTS_FIELD_KEYS.readiness.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Risk Profile",
    fields: BUYER_COTS_FIELD_KEYS.riskProfile.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Vendor Risk",
    fields: BUYER_COTS_FIELD_KEYS.vendorRisk.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Implementation",
    fields: BUYER_COTS_FIELD_KEYS.implementation.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Evidence",
    fields: BUYER_COTS_FIELD_KEYS.evidence.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Auto Generated",
    fields: BUYER_COTS_FIELD_KEYS.autoGenerated.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
];

const SYSTEM_ROLES = ["system admin", "system manager", "system viewer", "system user"];

const Assessments = () => {
  const navigate = useNavigate();
  const systemRole = (sessionStorage.getItem("systemRole") ?? "").toLowerCase().trim();
  const isBuyer = systemRole === "buyer";
  const isVendor = systemRole === "vendor";
  const isSystemUser = SYSTEM_ROLES.some((r) => r === systemRole);
  const [activeTab, setActiveTab] = useState<"vendor" | "buyer">("vendor");

  useEffect(() => {
    document.title = "AI Eval | Assessments";
  }, []);

  const [assessmentsList, setAssessmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [previewRow, setPreviewRow] = useState(null);

  const LOADER_MIN_MS = 2500; // show loader at least 2–3 seconds

  useEffect(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setLoading(false);
      return;
    }
    const startTime = Date.now();
    const organizationId = sessionStorage.getItem("organizationId");
    const query = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
    fetch(`${BASE_URL}/assessments${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.data?.assessments != null) {
          setAssessmentsList(result.data.assessments);
        } else {
          setAssessmentsList([]);
        }
      })
      .catch(() => {
        setFetchError("Failed to load assessments.");
        setAssessmentsList([]);
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
        setTimeout(() => setLoading(false), remaining);
      });
  }, []);

  const loadAssessments = () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;
    const organizationId = sessionStorage.getItem("organizationId");
    const query = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
    fetch(`${BASE_URL}/assessments${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.data?.assessments != null) setAssessmentsList(result.data.assessments);
        else setAssessmentsList([]);
      })
      .catch(() => setAssessmentsList([]));
  };

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") loadAssessments();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const handleNewAssessment = () => {
    if (isBuyer) navigate("/buyerAssessment");
    else if (isVendor) navigate("/vendorcots");
  };

  const handleDeleteDraft = async (assessmentId) => {
    if (!window.confirm("Permanently delete this draft assessment? This cannot be undone.")) return;
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/assessments/${assessmentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        loadAssessments();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch {
      alert("Failed to delete assessment");
    }
  };

  const showNewAssessment = isBuyer || isVendor;
  const buyerAssessments = assessmentsList.filter((a) => a.type === "cots_buyer");
  const vendorAssessments = assessmentsList.filter((a) => a.type === "cots_vendor");

  const customStyles = {
    table: {
      style: {
        width: "100%",
        backgroundColor: "#f8f8f8",
        border: "1px solid lightgray",
      },
    },
    cells: {
      style: {
        "&:last-of-type": {
          paddingRight: "12px",
        },
      },
    },
  };

  const columns = [
    {
      name: <div className="tableHeader">S.No</div>,
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: <div className="tableHeader">Type</div>,
      selector: (row) => (row.type === "cots_buyer" ? "COTS Assessment" : row.type === "cots_vendor" ? "COTS Vendor" : (row.type ?? "—")),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Status</div>,
      selector: (row) => {
        const s = (row.status ?? "").toLowerCase();
        return s === "draft" ? "Draft" : s === "submitted" || s === "completed" ? "Completed" : row.status ?? "—";
      },
      sortable: true,
    },
    {
      name: <div className="tableHeader">Vendor</div>,
      selector: (row) => truncate(row.vendorName, 20),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Product</div>,
      selector: (row) => truncate(row.productName, 20),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Use case</div>,
      selector: (row) => truncate(row.businessPainPoint, 30),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Criticality</div>,
      selector: (row) => truncate(row.criticality, 15),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Timeline</div>,
      selector: (row) => truncate(row.targetTimeline, 15),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Budget</div>,
      selector: (row) => truncate(row.budgetRange, 15),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Created</div>,
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Action</div>,
      cell: (row) => (
        <div className="actionButtons assessment_action_cell">
          <p
            className="editOrgImg assessment_view_btn"
            onClick={() => setPreviewRow(row)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setPreviewRow(row)}
          >
            <span>
              <Eye width={16} />
            </span>
            View
          </p>
        </div>
      ),
      ignoreRowClick: true,
      width: "100px",
      minWidth: "100px",
    },
  ];

  return (
    <div className="sec_user_page org_settings_page">
      <div className={`page_header_align ${isBuyer || isVendor || isSystemUser ? "ai_assessments_heading" : "heading_user_page"}`}>
        <div className="headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <ClipboardList size={24} />
          </span>
          <div className="page_header_title_block">
            <h1>Assessments</h1>
            <p className="sub_title sub_title_card">
              {isBuyer
                ? "Evaluate third-party vendors and manage your assessments."
                : isVendor || isSystemUser
                  ? "View and manage vendor and buyer assessments."
                  : "View and manage your assessments"}
            </p>
          </div>
        </div>
        {((showNewAssessment && !isBuyer) || isBuyer) && !isSystemUser && (
          <div className="btn_user_page">
            <Button className="invite_user_btn" onClick={handleNewAssessment}>
              <Plus size={24} />
              Assessment
            </Button>
          </div>
        )}
      </div>

      {isSystemUser && (
        <div className="ai_assessments_page">
          <div className="assessment_tabs">
            <button
              type="button"
              className={`assessment_tab ${activeTab === "vendor" ? "active" : ""}`}
              onClick={() => setActiveTab("vendor")}
            >
              Vendor
            </button>
            <button
              type="button"
              className={`assessment_tab ${activeTab === "buyer" ? "active" : ""}`}
              onClick={() => setActiveTab("buyer")}
            >
              Buyer
            </button>
          </div>
          {activeTab === "vendor" && (
            <div className="ai_assessments_section">
              <h2>Vendor COTS Assessment</h2>
              <p className="section_desc">Assess your solution fit and customer context for buyers.</p>
              <ul className="ai_assessments_checklist">
                <li><Check size={16} /> Customer discovery and pain points</li>
                <li><Check size={16} /> Solution fit and implementation</li>
                <li><Check size={16} /> Risk context and mitigation</li>
              </ul>
              <p className="your_assessments_title">YOUR ASSESSMENTS</p>
              {loading && <LoadingMessage message="Loading assessments…" />}
              {fetchError && <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>{fetchError}</p>}
              {!loading && !fetchError && (
                <div className="assessment_cards">
                  {vendorAssessments.length === 0 && (
                    <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>No vendor assessments yet.</p>
                  )}
                  {vendorAssessments.map((row) => {
                    const isDraft = (row.status || "").toLowerCase() === "draft";
                    const customerSectorVal = row.customerSector != null && String(row.customerSector).trim() !== "" ? String(row.customerSector).trim() : null;
                    const title = customerSectorVal ?? "Draft";
                    const statusLabel = isDraft ? "Draft" : "Completed";
                    const statusClass = isDraft ? "assessment_status_draft" : "assessment_status_completed";
                    const submittedDisplay = isDraft ? "—" : formatDate(row.vendorCotsUpdatedAt ?? row.updatedAt);
                    return (
                      <div key={row.assessmentId} className="assessment_card">
                        <h2 className="assessment_card_title">{truncate(title, 60)}</h2>
                        <div className="assessment_card_meta">
                          <div className="assessment_card_meta_row">
                            <span className="assessment_card_meta_label">Status</span>
                            <span className={`assessment_status ${statusClass}`}>{statusLabel}</span>
                          </div>
                          <div className="assessment_card_meta_row">
                            <span className="assessment_card_meta_label">Updated</span>
                            <span>{submittedDisplay}</span>
                          </div>
                        </div>
                        <div className="assessment_card_actions">
                          {isDraft && (
                            <>
                              <button
                                type="button"
                                className="assessment_card_btn assessment_card_btn_primary"
                                onClick={() => navigate(`/vendorcots/${row.assessmentId}`)}
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                              <button
                                type="button"
                                className="assessment_card_btn assessment_card_btn_danger"
                                onClick={() => handleDeleteDraft(row.assessmentId)}
                                aria-label="Delete draft"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </>
                          )}
                          {!isDraft && (
                            <button
                              type="button"
                              className="assessment_card_btn assessment_card_btn_secondary"
                              onClick={() => setPreviewRow(row)}
                            >
                              <Eye size={14} />
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {activeTab === "buyer" && (
            <div className="ai_assessments_section">
              <h2>Buy AI Product (COTS)</h2>
              <p className="section_desc">Assess a third-party vendor tool for your organization.</p>
              <ul className="ai_assessments_checklist">
                <li><Check size={16} /> Vendor security and compliance evaluation</li>
                <li><Check size={16} /> Data handling and privacy assessment</li>
                <li><Check size={16} /> Implementation readiness scoring</li>
                <li><Check size={16} /> Risk mitigation recommendations</li>
              </ul>
              <p className="your_assessments_title">YOUR ASSESSMENTS</p>
              {loading && <LoadingMessage message="Loading assessments…" />}
              {fetchError && <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>{fetchError}</p>}
              {!loading && !fetchError && (
                <div className="assessment_cards">
                  {buyerAssessments.length === 0 && (
                    <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>No assessments yet.</p>
                  )}
                  {buyerAssessments.map((row) => {
                    const isDraft = (row.status || "").toLowerCase() === "draft";
                    const industrySectorVal = row.industrySector != null && String(row.industrySector).trim() !== "" ? String(row.industrySector).trim() : null;
                    const title = industrySectorVal ?? "Draft";
                    const statusLabel = isDraft ? "Draft" : "Completed";
                    const statusClass = isDraft ? "assessment_status_draft" : "assessment_status_completed";
                    const submittedDisplay = isDraft ? "—" : formatDate(row.submittedDate ?? row.updatedAt);
                    return (
                      <div key={row.assessmentId} className="assessment_card">
                        <h2 className="assessment_card_title">{truncate(title, 60)}</h2>
                        <div className="assessment_card_meta">
                          <div className="assessment_card_meta_row">
                            <span className="assessment_card_meta_label">Status</span>
                            <span className={`assessment_status ${statusClass}`}>{statusLabel}</span>
                          </div>
                          <div className="assessment_card_meta_row">
                            <span className="assessment_card_meta_label">Submitted</span>
                            <span>{submittedDisplay}</span>
                          </div>
                        </div>
                        <div className="assessment_card_actions">
                          {isDraft && (
                            <>
                              <button
                                type="button"
                                className="assessment_card_btn assessment_card_btn_primary"
                                onClick={() => navigate(`/buyerAssessment/${row.assessmentId}`)}
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                              <button
                                type="button"
                                className="assessment_card_btn assessment_card_btn_danger"
                                onClick={() => handleDeleteDraft(row.assessmentId)}
                                aria-label="Delete draft"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </>
                          )}
                          {!isDraft && (
                            <button
                              type="button"
                              className="assessment_card_btn assessment_card_btn_secondary"
                              onClick={() => setPreviewRow(row)}
                            >
                              <Eye size={14} />
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isBuyer && (
        <div className="ai_assessments_page">
          <div className="ai_assessments_section">
              <h2>Buy AI Product (COTS)</h2>
              <p className="section_desc">Assess a third-party vendor tool for your organization.</p>
              <ul className="ai_assessments_checklist">
                <li><Check size={16} /> Vendor security and compliance evaluation</li>
                <li><Check size={16} /> Data handling and privacy assessment</li>
                <li><Check size={16} /> Implementation readiness scoring</li>
                <li><Check size={16} /> Risk mitigation recommendations</li>
              </ul>
              <p className="your_assessments_title">YOUR ASSESSMENTS</p>
              {loading && <LoadingMessage message="Loading assessments…" />}
              {fetchError && <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>{fetchError}</p>}
              {!loading && !fetchError && (
                <div className="assessment_cards">
                  {buyerAssessments.length === 0 && (
                    <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>No assessments yet.</p>
                  )}
                  {buyerAssessments.map((row) => {
                    const isDraft = (row.status || "").toLowerCase() === "draft";
                    const industrySectorVal = row.industrySector != null && String(row.industrySector).trim() !== "" ? String(row.industrySector).trim() : null;
                    const title = industrySectorVal ?? "Draft";
                    const statusLabel = isDraft ? "Draft" : "Completed";
                    const statusClass = isDraft ? "assessment_status_draft" : "assessment_status_completed";
                    const submittedDisplay = isDraft ? "—" : formatDate(row.submittedDate ?? row.updatedAt);
                    return (
                      <div key={row.assessmentId} className="assessment_card">
                        <h2 className="assessment_card_title">{truncate(title, 60)}</h2>
                        <div className="assessment_card_meta">
                          <div className="assessment_card_meta_row">
                            <span className="assessment_card_meta_label">Status</span>
                            <span className={`assessment_status ${statusClass}`}>{statusLabel}</span>
                          </div>
                          <div className="assessment_card_meta_row">
                            <span className="assessment_card_meta_label">Submitted</span>
                            <span>{submittedDisplay}</span>
                          </div>
                        </div>
                        <div className="assessment_card_actions">
                          {isDraft && (
                            <>
                              <button
                                type="button"
                                className="assessment_card_btn assessment_card_btn_primary"
                                onClick={() => navigate(`/buyerAssessment/${row.assessmentId}`)}
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                              <button
                                type="button"
                                className="assessment_card_btn assessment_card_btn_danger"
                                onClick={() => handleDeleteDraft(row.assessmentId)}
                                aria-label="Delete draft"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </>
                          )}
                          {!isDraft && (
                            <button
                              type="button"
                              className="assessment_card_btn assessment_card_btn_secondary"
                              onClick={() => setPreviewRow(row)}
                            >
                              <Eye size={14} />
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      )}

      {isVendor && (
        <div className="ai_assessments_page">
          <div className="ai_assessments_section">
            <h2>Vendor COTS Assessment</h2>
            <p className="section_desc">Assess your solution fit and customer context for buyers.</p>
            <ul className="ai_assessments_checklist">
              <li><Check size={16} /> Customer discovery and pain points</li>
              <li><Check size={16} /> Solution fit and implementation</li>
              <li><Check size={16} /> Risk context and mitigation</li>
            </ul>
            <p className="your_assessments_title">YOUR ASSESSMENTS</p>
            {loading && <LoadingMessage message="Loading assessments…" />}
            {fetchError && <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>{fetchError}</p>}
            {!loading && !fetchError && (
              <div className="assessment_cards">
                {vendorAssessments.length === 0 && (
                  <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>No vendor assessments yet.</p>
                )}
                {vendorAssessments.map((row) => {
                  const isDraft = (row.status || "").toLowerCase() === "draft";
                  const customerSectorVal = row.customerSector != null && String(row.customerSector).trim() !== "" ? String(row.customerSector).trim() : null;
                  const title = customerSectorVal ?? "Draft";
                  const statusLabel = isDraft ? "Draft" : "Completed";
                  const statusClass = isDraft ? "assessment_status_draft" : "assessment_status_completed";
                  const submittedDisplay = isDraft ? "—" : formatDate(row.vendorCotsUpdatedAt ?? row.updatedAt);
                  return (
                    <div key={row.assessmentId} className="assessment_card">
                      <h2 className="assessment_card_title">{truncate(title, 60)}</h2>
                      <div className="assessment_card_meta">
                        <div className="assessment_card_meta_row">
                          <span className="assessment_card_meta_label">Status</span>
                          <span className={`assessment_status ${statusClass}`}>{statusLabel}</span>
                        </div>
                        <div className="assessment_card_meta_row">
                          <span className="assessment_card_meta_label">Updated</span>
                          <span>{submittedDisplay}</span>
                        </div>
                      </div>
                      <div className="assessment_card_actions">
                        {isDraft && (
                          <>
                            <button
                              type="button"
                              className="assessment_card_btn assessment_card_btn_primary"
                              onClick={() => navigate(`/vendorcots/${row.assessmentId}`)}
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              type="button"
                              className="assessment_card_btn assessment_card_btn_danger"
                              onClick={() => handleDeleteDraft(row.assessmentId)}
                              aria-label="Delete draft"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </>
                        )}
                        {!isDraft && (
                          <button
                            type="button"
                            className="assessment_card_btn assessment_card_btn_secondary"
                            onClick={() => setPreviewRow(row)}
                          >
                            <Eye size={14} />
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {!isBuyer && !isVendor && !isSystemUser && (
        <div className="table_user_page">
          <div className="orgDataTable">
            {loading && <LoadingMessage message="Loading assessments…" />}
            {fetchError && <p style={{ color: "#dc2626", padding: "1rem 0" }}>{fetchError}</p>}
            {!loading && !fetchError && assessmentsList.length === 0 && (
              <p style={{ color: "#64748b", padding: "1rem 0" }}>No assessments yet. Create one using the button above.</p>
            )}
            {!loading && assessmentsList.length > 0 && (
              <DataTable
                customStyles={customStyles}
                columns={columns}
                data={assessmentsList}
                pagination
                persistTableHead
              />
            )}
          </div>
        </div>
      )}

      <Modal isOpen={!!previewRow}>
        <div className="header_modal" style={{ maxWidth: "56em" }}>
          <div>
            <h2 className="modal_popup_title">Assessment details</h2>
            <p className="modal_sub_title">Preview of submitted assessment (same as COTS)</p>
          </div>
          <div className="cancel">
            <Button
              className="user_cancel_btn"
              onClick={() => setPreviewRow(null)}
            >
              <span>
                <CircleX />
              </span>
            </Button>
          </div>
        </div>
        {previewRow && (
          <div className="popup_fields assessment_preview_modal_body" style={{ maxHeight: "70vh", overflowY: "auto", maxWidth: "56em" }}>
            {previewRow.type === "cots_vendor" ? (
              <>
                <div style={{ marginBottom: 24 }}>
                  <PreviewTable
                    dataForPreview={previewRow}
                    previewFields={[
                      { label: "Type", value: () => "COTS Vendor" },
                      { label: "Status", value: (r) => r.status ?? undefined },
                      { label: "Created", value: (r) => formatDate(r.createdAt) },
                    ]}
                    previewTitle="Assessment"
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <PreviewTable
                    dataForPreview={previewRow}
                    previewFields={[
                      { label: "Customer organization", value: (r) => getRowPreviewValue(r, "customerOrganizationName") },
                      { label: "Customer sector", value: (r) => formatSectorForPreview(getRowPreviewValue(r, "customerSector")) },
                      { label: "Primary pain point", value: (r) => getRowPreviewValue(r, "primaryPainPoint") },
                      { label: "Expected outcomes", value: (r) => getRowPreviewValue(r, "vendorExpectedOutcomes") },
                      { label: "Budget range", value: (r) => getRowPreviewValue(r, "customerBudgetRange") },
                      { label: "Timeline", value: (r) => getRowPreviewValue(r, "implementationTimeline") },
                      { label: "Alternatives considered", value: (r) => getRowPreviewValue(r, "alternativesConsidered") },
                      { label: "Key advantages", value: (r) => getRowPreviewValue(r, "keyAdvantages") },
                    ]}
                    previewTitle="Vendor COTS"
                  />
                </div>
              </>
            ) : (
              ASSESSMENT_PREVIEW_SECTIONS.map((section) => (
                <div key={section.title} style={{ marginBottom: 24 }}>
                  <PreviewTable
                    dataForPreview={previewRow}
                    previewFields={section.fields}
                    previewTitle={section.title}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Assessments;
