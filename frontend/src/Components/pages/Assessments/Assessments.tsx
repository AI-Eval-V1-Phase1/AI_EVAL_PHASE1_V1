import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ClipboardList,
  Eye,
  CircleX,
  Check,
  SquarePen,
  CheckCircle,
  CircleCheck,
  Target,
  Calendar,
  FileText,
  CheckCircle2,
  Search,
  Trash2,
} from "lucide-react";
import DataTable from "react-data-table-component";
import Button from "../../UI/Button";
import Modal from "../../UI/Modal";
import LoadingMessage from "../../UI/LoadingMessage";
import PreviewTable from "../../preview/PreviewTable";
import type { PreviewField } from "../../../types/preview";
import { BUYER_COTS_FIELD_KEYS } from "../../../constants/buyerCotsAssessmentKeys";
import { formatPreviewValue } from "../../../utils/formatPreviewValue";
import { formatDateDDMMMYYYY } from "../../../utils/formatDate.js";
import "../../../styles/page_tabs.css";
import "../Organizations/organization.css";
import "../UserManagement/user_management.css";
import "../../preview/preview_table.css";
import "./assessments.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/** Keys from list API that count toward progress (cots_buyer fields) */
const BUYER_COTS_PROGRESS_KEYS = [
  "businessPainPoint",
  "expectedOutcomes",
  "owningDepartment",
  "budgetRange",
  "targetTimeline",
  "criticality",
  "vendorName",
  "productName",
  "requirementGaps",
  "integrationSystems",
  "techStack",
  "digitalMaturityLevel",
  "dataGovernanceMaturity",
  "aiGovernanceBoard",
  "aiEthicsPolicy",
  "implementationTeamComposition",
  "dataSensitivity",
  "regulatoryRequirements",
  "riskAppetite",
  "decisionStakes",
  "impactedStakeholders",
  "vendorValidationApproach",
  "vendorSecurityPosture",
  "vendorCertifications",
  "pilotRolloutPlan",
  "rollbackCapability",
  "changeManagementPlan",
  "monitoringDataAvailable",
  "auditLogsAvailable",
  "testingResultsAvailable",
  "identifiedRisks",
  "riskDomainScores",
  "contextualMultipliers",
  "riskMitigation",
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

const truncate = (str, max = 40) => {
  if (str == null || str === "") return "—";
  const s = String(str);
  return s.length <= max ? s : `${s.slice(0, max)}…`;
};

/** Display name of user who completed/updated the assessment (from list API completedBy* and completedByUserId from db). */
function getCompletedByDisplay(row) {
  if (!row) return "";
  const first = (row.completedByUserFirstName ?? "").toString().trim();
  const last = (row.completedByUserLastName ?? "").toString().trim();
  const fullName = [first, last].filter(Boolean).join(" ");
  if (fullName) return fullName;
  const userName = (row.completedByUserName ?? "").toString().trim();
  if (userName) return userName;
  const email = (row.completedByUserEmail ?? "").toString().trim();
  if (email) return email;
  const userId = row.completedByUserId;
  if (userId != null && userId !== "") return `User #${userId}`;
  return "";
}

/** True when assessment has an expiry date and it has passed (expiry date is before today). */
function isAssessmentExpired(row) {
  const expiryStr = row?.expiryAt;
  if (expiryStr == null || String(expiryStr).trim() === "") return false;
  try {
    const expiry = new Date(expiryStr);
    if (Number.isNaN(expiry.getTime())) return false;
    const today = new Date();
    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return expiry.getTime() < today.getTime();
  } catch {
    return false;
  }
}

/** Display status: Draft, Expired (when past expiryAt), Completed, or raw status. */
function getAssessmentStatusLabel(row) {
  if (!row) return "—";
  const s = (row.status ?? "").toLowerCase();
  if (s === "draft") return "Draft";
  if (s === "submitted" || s === "completed") {
    return isAssessmentExpired(row) ? "Expired" : "Completed";
  }
  return row.status ?? "—";
}

/** Title for assessment row (used for search filter). Uses organization name and product name. */
function getAssessmentTitle(row, isBuyerRow) {
  const org = isBuyerRow
    ? (row.organizationName != null && String(row.organizationName).trim() !== "" ? String(row.organizationName).trim() : null)
    : (row.customerOrganizationName != null && String(row.customerOrganizationName).trim() !== "" ? String(row.customerOrganizationName).trim() : null);
  const product = row.productName != null && String(row.productName).trim() !== "" ? String(row.productName).trim() : null;
  const parts = [org, product].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "Draft";
}

/** Organization and product name from that assessment form (buyer: org = organizationName; vendor: org = customerOrganizationName). */
function getAssessmentOrgAndProduct(row, isBuyerRow) {
  const org = isBuyerRow ? (row.organizationName ?? "") : (row.customerOrganizationName ?? "");
  const product = row.productName ?? "";
  return { orgName: String(org).trim(), productName: String(product).trim() };
}

/** Single-line card title: "Organization Name - Product Name" from that assessment form, or "Draft" if both empty. */
function getAssessmentDisplayTitle(row, isBuyerRow) {
  const { orgName, productName } = getAssessmentOrgAndProduct(row, isBuyerRow);
  if (orgName === "" && productName === "") return "Draft";
  return `${orgName || "—"} - ${productName || "—"}`;
}

/** Parse COTS assessment points from risk domain scores (buyer: riskDomainScores, vendor: vendorRiskDomainScores). Returns total points or null. */
function getCotsAssessmentPoints(row, isBuyerRow) {
  const raw = isBuyerRow ? row.riskDomainScores : row.vendorRiskDomainScores;
  if (raw == null || (typeof raw === "string" && raw.trim() === "")) return null;
  const s = typeof raw === "string" ? raw.trim() : String(raw);
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) {
      const sum = parsed.reduce((acc, item) => {
        const n = typeof item === "object" && item != null && "score" in item ? Number(item.score) : Number(item);
        return acc + (Number.isNaN(n) ? 0 : n);
      }, 0);
      return sum > 0 ? sum : null;
    }
    if (typeof parsed === "object" && parsed !== null) {
      const sum = Object.values(parsed).reduce((acc, v) => {
        const n = Number(v);
        return acc + (Number.isNaN(n) ? 0 : n);
      }, 0);
      return sum > 0 ? sum : null;
    }
  } catch {
    const numList = s.match(/\d+/g);
    if (numList && numList.length > 0) {
      const sum = numList.reduce((acc, n) => acc + parseInt(n, 10), 0);
      return sum > 0 ? sum : null;
    }
  }
  return null;
}

/** Get display value from assessment row (API shape: camelCase, arrays for jsonb) */
function getRowPreviewValue(row, key) {
  if (row == null) return undefined;
  const v = row[key];
  if (v == null || (typeof v === "string" && v.trim() === "")) return undefined;
  if (key === "createdAt" || key === "cotsUpdatedAt" || key === "expiryAt") return formatDateDDMMMYYYY(v);
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
      {
        label: "Type",
        value: (r) =>
          r.type === "cots_buyer"
            ? "COTS Assessment"
            : r.type === "cots_vendor"
              ? "COTS Vendor"
              : (r.type ?? undefined),
      },
      { label: "Status", value: (r) => getAssessmentStatusLabel(r) },
      { label: "Created on", value: (r) => formatDateDDMMMYYYY(r.createdAt) },
      { label: "Expires on", value: (r) => formatDateDDMMMYYYY(r.expiryAt) },
    ],
  },
  {
    title: "Use Case",
    fields: BUYER_COTS_FIELD_KEYS.useCase.map((key) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Vendor Evaluation",
    fields: BUYER_COTS_FIELD_KEYS.vendorEvaluation.map((key) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Readiness",
    fields: BUYER_COTS_FIELD_KEYS.readiness.map((key) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Risk Profile",
    fields: BUYER_COTS_FIELD_KEYS.riskProfile.map((key) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Vendor Risk",
    fields: BUYER_COTS_FIELD_KEYS.vendorRisk.map((key) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Implementation",
    fields: BUYER_COTS_FIELD_KEYS.implementation.map((key) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
  {
    title: "Evidence",
    fields: BUYER_COTS_FIELD_KEYS.evidence.map((key) => ({
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase()),
      value: (r) => getRowPreviewValue(r, key),
    })),
  },
];

const SYSTEM_ROLES = [
  "system admin",
  "system manager",
  "system viewer",
  "system user",
];

const Assessments = () => {
  const navigate = useNavigate();
  const systemRole = (sessionStorage.getItem("systemRole") ?? "")
    .toLowerCase()
    .trim();
  const isBuyer = systemRole === "buyer";
  const isVendor = systemRole === "vendor";
  const isSystemUser = SYSTEM_ROLES.some((r) => r === systemRole);
  const [activeTab, setActiveTab] = useState<"vendor" | "buyer" | "my" | "archived">(
    "vendor",
  );
  // const titlesForPage = [
  //   vendor""{
  //    "system"
  //   }
  // ]

  useEffect(() => {
    document.title = "AI Eval | Assessments";
  }, []);

  const [assessmentsList, setAssessmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [previewRow, setPreviewRow] = useState(null);
  const [vendorCotsPreviewDetail, setVendorCotsPreviewDetail] = useState(null);
  const [vendorCotsPreviewLoading, setVendorCotsPreviewLoading] = useState(false);
  const [assessmentSearch, setAssessmentSearch] = useState("");
  const [showArchivedBuyer, setShowArchivedBuyer] = useState(false);
  const [showArchivedVendor, setShowArchivedVendor] = useState(false);

  const LOADER_MIN_MS = 2500; // show loader at least 2–3 seconds

  useEffect(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setLoading(false);
      return;
    }
    const startTime = Date.now();
    const organizationId = sessionStorage.getItem("organizationId");
    const query = organizationId
      ? `?organizationId=${encodeURIComponent(organizationId)}`
      : "";
    fetch(`${BASE_URL}/assessments${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json().then((result) => {
          if (!res.ok) {
            setFetchError(result?.message || "Failed to load assessments.");
            setAssessmentsList([]);
            return;
          }
          if (result?.data?.assessments != null) {
            setAssessmentsList(result.data.assessments);
          } else {
            setAssessmentsList([]);
          }
        });
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
    const query = organizationId
      ? `?organizationId=${encodeURIComponent(organizationId)}`
      : "";
    fetch(`${BASE_URL}/assessments${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.data?.assessments != null)
          setAssessmentsList(result.data.assessments);
        else setAssessmentsList([]);
      })
      .catch(() => setAssessmentsList([]));
  };

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") loadAssessments();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const handleNewAssessment = () => {
    if (isBuyer) navigate("/buyerAssessment");
    else if (isVendor) navigate("/vendorcots");
  };

  // When View is opened for a vendor COTS assessment, fetch full details by ID so modal shows all fields.
  useEffect(() => {
    if (!previewRow || previewRow.type !== "cots_vendor" || !previewRow.assessmentId) {
      setVendorCotsPreviewDetail(null);
      setVendorCotsPreviewLoading(false);
      return;
    }
    setVendorCotsPreviewDetail(null);
    setVendorCotsPreviewLoading(true);
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setVendorCotsPreviewLoading(false);
      return;
    }
    fetch(`${BASE_URL}/vendorCotsAssessment/${previewRow.assessmentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.success && result?.data) setVendorCotsPreviewDetail(result.data);
      })
      .catch(() => {})
      .finally(() => setVendorCotsPreviewLoading(false));
  }, [previewRow?.assessmentId, previewRow?.type]);

  const handleDeleteDraft = async (assessmentId) => {
    if (
      !window.confirm(
        "Permanently delete this draft assessment? This cannot be undone.",
      )
    )
      return;
    await doDeleteAssessment(assessmentId);
  };

  const handleDeleteExpired = async (assessmentId) => {
    if (
      !window.confirm(
        "Permanently delete this expired assessment? This cannot be undone.",
      )
    )
      return;
    await doDeleteAssessment(assessmentId);
  };

  async function doDeleteAssessment(assessmentId) {
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
  }

  const showNewAssessment = isBuyer || isVendor;
  const organizationId = sessionStorage.getItem("organizationId") ?? "";
  const orgScopedList =
    isBuyer && organizationId
      ? assessmentsList.filter(
          (a) => String(a.organizationId ?? "") === String(organizationId),
        )
      : assessmentsList;
  const buyerAssessments = orgScopedList.filter((a) => a.type === "cots_buyer");
  const vendorAssessments = orgScopedList.filter(
    (a) => a.type === "cots_vendor",
  );
  const myOrgId = sessionStorage.getItem("organizationId") ?? "";
  const myAssessments = myOrgId
    ? assessmentsList.filter(
        (a) => String(a.organizationId ?? "") === String(myOrgId),
      )
    : [];

  const archivedAssessments = (isSystemUser ? myAssessments : orgScopedList).filter(
    (row) => isAssessmentExpired(row),
  );
  const archivedBuyerAssessments = buyerAssessments.filter((row) =>
    isAssessmentExpired(row),
  );
  const archivedVendorAssessments = vendorAssessments.filter((row) =>
    isAssessmentExpired(row),
  );
  const nonExpiredVendor = vendorAssessments.filter(
    (row) => !isAssessmentExpired(row),
  );
  const nonExpiredBuyer = buyerAssessments.filter(
    (row) => !isAssessmentExpired(row),
  );
  const nonExpiredMy = myAssessments.filter(
    (row) => !isAssessmentExpired(row),
  );

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
      selector: (row) =>
        row.type === "cots_buyer"
          ? "COTS Assessment"
          : row.type === "cots_vendor"
            ? "COTS Vendor"
            : (row.type ?? "—"),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Status</div>,
      selector: (row) => getAssessmentStatusLabel(row),
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
      name: <div className="tableHeader">Created on</div>,
      selector: (row) => formatDateDDMMMYYYY(row.createdAt),
      sortable: true,
    },
    {
      name: <div className="tableHeader">Expires on</div>,
      selector: (row) => formatDateDDMMMYYYY(row.expiryAt),
      cell: (row) => (
        <span className="vendor_overview_attestation_date_expiry">
          {formatDateDDMMMYYYY(row.expiryAt)}
        </span>
      ),
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
      <div
        className={`org_settings_header page_header_align ${isBuyer || isVendor || isSystemUser ? "ai_assessments_heading" : "heading_user_page"}`}
      >
        <div className="org_settings_headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <ClipboardList size={24} className="header_icon_svg" />
          </span>
          <div className="page_header_title_block">
            <h1 className="org_settings_title page_header_title">
              {isBuyer
                ? "Assessments"
                : isVendor || isSystemUser
                  ? "Customer Assessments"
                  : "Assessments"}
            </h1>
            <p className="org_settings_subtitle page_header_subtitle">
              {isBuyer
                ? "Evaluate third-party vendors and manage your assessments."
                : isVendor || isSystemUser
                  ? "Complete and submit your customer assessments for sales opportunities."
                  : "View and manage vendor and buyer assessments."}
            </p>
          </div>
        </div>
        {((showNewAssessment && !isBuyer) || isBuyer) && !isSystemUser && (
          <div className="btn_user_page">
            <Button className="invite_user_btn" onClick={handleNewAssessment}>
              <Plus size={24} />
              {isVendor ? "Customer Assessment" : "Assessment"}
            </Button>
          </div>
        )}
        {isSystemUser && (
          <div className="btn_user_page">
            <Button
              className="invite_user_btn"
              onClick={() => navigate("/vendorcots")}
            >
              <Plus size={24} />
              Customer Assessment
            </Button>
          </div>
        )}
      </div>

      {isSystemUser && (
        <div className="ai_assessments_page">
          <div className="page_tabs">
            <button
              type="button"
              className={`page_tab ${activeTab === "vendor" ? "page_tab_active" : ""}`}
              onClick={() => setActiveTab("vendor")}
            >
              Vendor
            </button>
            <button
              type="button"
              className={`page_tab ${activeTab === "buyer" ? "page_tab_active" : ""}`}
              onClick={() => setActiveTab("buyer")}
            >
              Buyer
            </button>
            <button
              type="button"
              className={`page_tab ${activeTab === "my" ? "page_tab_active" : ""}`}
              onClick={() => setActiveTab("my")}
            >
              My Assessments
            </button>
            <button
              type="button"
              className={`page_tab ${activeTab === "archived" ? "page_tab_active" : ""}`}
              onClick={() => setActiveTab("archived")}
            >
              Archived
            </button>
          </div>
          {activeTab === "vendor" && (
            <div className="ai_assessments_section">
              <h2>Vendor COTS Assessment</h2>
              <p className="section_desc">
                Assess your solution fit and customer context for buyers.
              </p>
              <ul className="ai_assessments_checklist">
                <li>
                  <CircleCheck size={16} /> Customer discovery and pain points
                </li>
                <li>
                  <CircleCheck size={16} /> Solution fit and implementation
                </li>
                <li>
                  <CircleCheck size={16} /> Risk context and mitigation
                </li>
              </ul>
              <div className="assessment_list_header_row">
                <p className="your_assessments_title">YOUR ASSESSMENTS</p>
                <div className="assessment_search_wrap">
                  <Search size={18} className="assessment_search_icon" aria-hidden />
                  <input
                    type="search"
                    placeholder="Search assessments…"
                    value={assessmentSearch}
                    onChange={(e) => setAssessmentSearch(e.target.value)}
                    className="assessment_search_input"
                    aria-label="Search assessments by name"
                  />
                </div>
              </div>
              {loading && <LoadingMessage message="Loading assessments…" />}
              {fetchError && (
                <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>
                  {fetchError}
                </p>
              )}
              {!loading && !fetchError && (
                <div className="assessment_list_rows">
                  {(() => {
                    const q = assessmentSearch.trim().toLowerCase();
                    const filtered = q === "" ? nonExpiredVendor : nonExpiredVendor.filter((row) => getAssessmentTitle(row, false).toLowerCase().includes(q));
                    return filtered.length === 0 ? (
                      <p className="assessment_search_no_results">
                        {nonExpiredVendor.length === 0 ? "No vendor assessments yet." : "No assessments match your search."}
                      </p>
                    ) : (
                      filtered.map((row) => {
                    const isDraft =
                      (row.status || "").toLowerCase() === "draft";
                    const statusLabel = getAssessmentStatusLabel(row);
                    const submittedDisplay = formatDateDDMMMYYYY(
                      row.vendorCotsUpdatedAt ?? row.updatedAt,
                    );
                    const completedBy = getCompletedByDisplay(row) || "—";
                    const vendorPoints = getCotsAssessmentPoints(row, false);
                    return (
                      <div key={row.assessmentId} className="vendor_overview_attestation_row">
                        {isDraft && <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_draft" aria-hidden />}
                        {!isDraft && <FileText size={24} className={`vendor_overview_attestation_icon ${statusLabel === "Expired" ? "vendor_overview_attestation_icon_expired" : "vendor_overview_attestation_icon_check"}`} aria-hidden />}
                        <div className="vendor_overview_attestation_content">
                          <p className="vendor_overview_attestation_name">{truncate(getAssessmentDisplayTitle(row, false), 60)}</p>
                          <p className={`vendor_overview_attestation_status_label${isDraft ? " vendor_overview_attestation_status_label_draft" : ""}${statusLabel === "Expired" ? " vendor_overview_attestation_status_label_expired" : ""}`}>
                            {statusLabel}
                          </p>
                          <p className="vendor_overview_attestation_by">
                            {isDraft ? "Updated by:" : "Completed by:"} {completedBy}
                          </p>
                          <p className="vendor_overview_attestation_date">
                            {isDraft ? "Drafted on" : "Created on"}: {formatDateDDMMMYYYY(row.createdAt)}
                          </p>
                          <p className="vendor_overview_attestation_points">
                            COTS points: {vendorPoints != null ? vendorPoints : "—"}
                          </p>
                        </div>
                        <div className="vendor_overview_attestation_actions">
                          {isDraft && (
                            <button
                              type="button"
                              className="vendor_overview_btn_view"
                              onClick={() =>
                                navigate(`/vendorcots/${row.assessmentId}`)
                              }
                            >
                              <SquarePen size={16} aria-hidden />
                              Edit
                            </button>
                          )}
                          {!isDraft && (
                            <button
                              type="button"
                              className="vendor_overview_btn_view"
                              onClick={() => setPreviewRow(row)}
                            >
                              <Eye size={14} aria-hidden />
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                  );
                  })()}
                </div>
              )}
            </div>
          )}
          {activeTab === "buyer" && (
            <div className="ai_assessments_section">
              <h2>Buy AI Product (COTS)</h2>
              <p className="section_desc">
                Assess a third-party vendor tool for your organization.
              </p>
              <ul className="ai_assessments_checklist">
                <li>
                  <CircleCheck size={16} /> Vendor security and compliance evaluation
                </li>
                <li>
                  <CircleCheck size={16} /> Data handling and privacy assessment
                </li>
                <li>
                  <CircleCheck size={16} /> Implementation readiness scoring
                </li>
                <li>
                  <CircleCheck size={16} /> Risk mitigation recommendations
                </li>
              </ul>
              <div className="assessment_list_header_row">
                <p className="your_assessments_title">YOUR ASSESSMENTS</p>
                <div className="assessment_search_wrap">
                  <Search size={18} className="assessment_search_icon" aria-hidden />
                  <input
                    type="search"
                    placeholder="Search assessments…"
                    value={assessmentSearch}
                    onChange={(e) => setAssessmentSearch(e.target.value)}
                    className="assessment_search_input"
                    aria-label="Search assessments by name"
                  />
                </div>
              </div>
              {loading && <LoadingMessage message="Loading assessments…" />}
              {fetchError && (
                <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>
                  {fetchError}
                </p>
              )}
              {!loading && !fetchError && (
                <div className="assessment_list_rows">
                  {(() => {
                    const q = assessmentSearch.trim().toLowerCase();
                    const filtered = q === "" ? nonExpiredBuyer : nonExpiredBuyer.filter((row) => getAssessmentTitle(row, true).toLowerCase().includes(q));
                    if (filtered.length === 0) return <p className="assessment_search_no_results">{nonExpiredBuyer.length === 0 ? "No assessments yet." : "No assessments match your search."}</p>;
                    return filtered.map((row) => {
                    const isDraft =
                      (row.status || "").toLowerCase() === "draft";
                    const statusLabel = getAssessmentStatusLabel(row);
                    const updatedAtDisplay = formatDateDDMMMYYYY(
                      row.updatedAt ?? row.cotsUpdatedAt ?? row.submittedDate,
                    );
                    const submittedDisplay = isDraft
                      ? updatedAtDisplay
                      : formatDateDDMMMYYYY(row.submittedDate ?? row.updatedAt);
                    const completedBy = getCompletedByDisplay(row) || "—";
                    const buyerPoints = getCotsAssessmentPoints(row, true);
                    return (
                      <div key={row.assessmentId} className="vendor_overview_attestation_row">
                        {isDraft && <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_draft" aria-hidden />}
                        {!isDraft && <FileText size={24} className={`vendor_overview_attestation_icon ${statusLabel === "Expired" ? "vendor_overview_attestation_icon_expired" : "vendor_overview_attestation_icon_check"}`} aria-hidden />}
                        <div className="vendor_overview_attestation_content">
                          <p className="vendor_overview_attestation_name">{truncate(getAssessmentDisplayTitle(row, true), 60)}</p>
                          <p className={`vendor_overview_attestation_status_label${isDraft ? " vendor_overview_attestation_status_label_draft" : ""}${statusLabel === "Expired" ? " vendor_overview_attestation_status_label_expired" : ""}`}>
                            {statusLabel}
                          </p>
                          <p className="vendor_overview_attestation_by">
                            {isDraft ? "Updated by:" : "Completed by:"} {completedBy}
                          </p>
                          <p className="vendor_overview_attestation_date">
                            {isDraft ? "Drafted on" : "Created on"}: {formatDateDDMMMYYYY(row.createdAt)}
                          </p>
                          <p className="vendor_overview_attestation_points">
                            COTS points: {buyerPoints != null ? buyerPoints : "—"}
                          </p>
                        </div>
                        <div className="vendor_overview_attestation_actions">
                          {isDraft && (
                            <button
                              type="button"
                              className="vendor_overview_btn_view"
                              onClick={() =>
                                navigate(
                                  `/buyerAssessment/${row.assessmentId}`,
                                )
                              }
                            >
                              <SquarePen size={16} aria-hidden />
                              Edit
                            </button>
                          )}
                          {!isDraft && (
                            <button
                              type="button"
                              className="vendor_overview_btn_view"
                              onClick={() => setPreviewRow(row)}
                            >
                              <Eye size={14} aria-hidden />
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                  })()}
                </div>
              )}
            </div>
          )}
          {activeTab === "my" && (
            <div className="ai_assessments_section">
              <h2>My Assessments</h2>
              <p className="section_desc">Assessments for your organization.</p>
              <div className="assessment_list_header_row">
                <p className="your_assessments_title">YOUR ASSESSMENTS</p>
                <div className="assessment_search_wrap">
                  <Search size={18} className="assessment_search_icon" aria-hidden />
                  <input
                    type="search"
                    placeholder="Search assessments…"
                    value={assessmentSearch}
                    onChange={(e) => setAssessmentSearch(e.target.value)}
                    className="assessment_search_input"
                    aria-label="Search assessments by name"
                  />
                </div>
              </div>
              {loading && <LoadingMessage message="Loading assessments…" />}
              {fetchError && (
                <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>
                  {fetchError}
                </p>
              )}
              {!loading && !fetchError && (
                <div className="assessment_list_rows">
                  {(() => {
                    const q = assessmentSearch.trim().toLowerCase();
                    const filtered = q === "" ? nonExpiredMy : nonExpiredMy.filter((row) => {
                      const isBuyerRow = (row.type || "").toLowerCase() === "cots_buyer";
                      return getAssessmentTitle(row, isBuyerRow).toLowerCase().includes(q);
                    });
                    if (filtered.length === 0) return <p className="assessment_search_no_results">{nonExpiredMy.length === 0 ? "No assessments yet." : "No assessments match your search."}</p>;
                    return filtered.map((row) => {
                    const isBuyerRow =
                      (row.type || "").toLowerCase() === "cots_buyer";
                    const isDraft =
                      (row.status || "").toLowerCase() === "draft";
                    const statusLabel = getAssessmentStatusLabel(row);
                    const statusClass = isDraft
                      ? "assessment_status_draft"
                      : "assessment_status_completed";
                    const typeLabel = isBuyerRow ? "COTS Buyer" : "COTS Vendor";
                    const updatedAtDisplay = formatDateDDMMMYYYY(
                      isBuyerRow
                        ? (row.updatedAt ?? row.cotsUpdatedAt)
                        : (row.vendorCotsUpdatedAt ?? row.updatedAt),
                    );
                    const submittedDisplay = isDraft
                      ? updatedAtDisplay
                      : formatDateDDMMMYYYY(
                          isBuyerRow
                            ? (row.submittedDate ?? row.updatedAt)
                            : (row.vendorCotsUpdatedAt ?? row.updatedAt),
                        );
                    const completedBy = getCompletedByDisplay(row) || "—";
                    return (
                      <div key={row.assessmentId} className="vendor_overview_attestation_row">
                        {isDraft && <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_draft" aria-hidden />}
                        {!isDraft && <FileText size={24} className={`vendor_overview_attestation_icon ${statusLabel === "Expired" ? "vendor_overview_attestation_icon_expired" : "vendor_overview_attestation_icon_check"}`} aria-hidden />}
                        <div className="vendor_overview_attestation_content">
                          <p className="vendor_overview_attestation_name">{truncate(getAssessmentDisplayTitle(row, isBuyerRow), 60)}</p>
                          <p className={`vendor_overview_attestation_status_label${isDraft ? " vendor_overview_attestation_status_label_draft" : ""}${statusLabel === "Expired" ? " vendor_overview_attestation_status_label_expired" : ""}`}>
                            {statusLabel}
                          </p>
                          <p className="vendor_overview_attestation_by">
                            {isDraft ? "Updated by:" : "Completed by:"} {completedBy}
                          </p>
                          {isDraft ? (
                            <p className="vendor_overview_attestation_date">
                              Drafted on: {formatDateDDMMMYYYY(row.createdAt)}
                            </p>
                          ) : (
                            <div className="vendor_overview_attestation_date_row">
                              <p className="vendor_overview_attestation_date">
                                Created on: {formatDateDDMMMYYYY(row.createdAt)}
                              </p>
                              <p className="vendor_overview_attestation_date vendor_overview_attestation_date_expiry">
                                Expires on: {formatDateDDMMMYYYY(row.expiryAt)}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="vendor_overview_attestation_actions">
                          {isDraft && (
                            <button
                              type="button"
                              className="vendor_overview_btn_view"
                              onClick={() =>
                                navigate(
                                  isBuyerRow
                                    ? `/buyerAssessment/${row.assessmentId}`
                                    : `/vendorcots/${row.assessmentId}`,
                                )
                              }
                            >
                              <SquarePen size={16} aria-hidden />
                              Edit
                            </button>
                          )}
                          {!isDraft && (
                            <button
                              type="button"
                              className="vendor_overview_btn_view"
                              onClick={() => setPreviewRow(row)}
                            >
                              <Eye size={14} aria-hidden />
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                  })()}
                </div>
              )}
            </div>
          )}
          {activeTab === "archived" && (
            <div className="ai_assessments_section">
              <h2>Archived</h2>
              <p className="section_desc">
                Expired assessments. You can delete them permanently.
              </p>
              <div className="assessment_list_header_row">
                <p className="your_assessments_title">YOUR ASSESSMENTS</p>
                <div className="assessment_search_wrap">
                  <Search size={18} className="assessment_search_icon" aria-hidden />
                  <input
                    type="search"
                    placeholder="Search archived…"
                    value={assessmentSearch}
                    onChange={(e) => setAssessmentSearch(e.target.value)}
                    className="assessment_search_input"
                    aria-label="Search archived assessments"
                  />
                </div>
              </div>
              {loading && <LoadingMessage message="Loading assessments…" />}
              {fetchError && (
                <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>
                  {fetchError}
                </p>
              )}
              {!loading && !fetchError && (
                <div className="assessment_list_rows">
                  {(() => {
                    const q = assessmentSearch.trim().toLowerCase();
                    const filtered =
                      q === ""
                        ? archivedAssessments
                        : archivedAssessments.filter((row) => {
                            const isBuyerRow = (row.type || "").toLowerCase() === "cots_buyer";
                            return getAssessmentTitle(row, isBuyerRow).toLowerCase().includes(q);
                          });
                    if (filtered.length === 0)
                      return (
                        <p className="assessment_search_no_results">
                          {archivedAssessments.length === 0
                            ? "No archived assessments."
                            : "No archived assessments match your search."}
                        </p>
                      );
                    return filtered.map((row) => {
                      const isBuyerRow = (row.type || "").toLowerCase() === "cots_buyer";
                      const completedBy = getCompletedByDisplay(row) || "—";
                      return (
                        <div key={row.assessmentId} className="vendor_overview_attestation_row">
                          <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_expired" aria-hidden />
                          <div className="vendor_overview_attestation_content">
                            <p className="vendor_overview_attestation_name">
                              {truncate(getAssessmentDisplayTitle(row, isBuyerRow), 60)}
                            </p>
                            <p className="vendor_overview_attestation_status_label vendor_overview_attestation_status_label_expired">
                              Expired
                            </p>
                            <p className="vendor_overview_attestation_by">
                              Completed by: {completedBy}
                            </p>
                            <div className="vendor_overview_attestation_date_row">
                              <p className="vendor_overview_attestation_date">
                                Created on: {formatDateDDMMMYYYY(row.createdAt)}
                              </p>
                              <p className="vendor_overview_attestation_date vendor_overview_attestation_date_expiry">
                                Expires on: {formatDateDDMMMYYYY(row.expiryAt)}
                              </p>
                            </div>
                          </div>
                          <div className="vendor_overview_attestation_actions">
                            <button
                              type="button"
                              className="vendor_overview_btn_view vendor_overview_btn_danger"
                              onClick={() => handleDeleteExpired(row.assessmentId)}
                              aria-label="Delete assessment"
                            >
                              <Trash2 size={16} aria-hidden />
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
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
            <p className="section_desc">
              Assess a third-party vendor tool for your organization.
            </p>
            <ul className="ai_assessments_checklist">
              <li>
                <CircleCheck size={16} /> Vendor security and compliance evaluation
              </li>
              <li>
                <CircleCheck size={16} /> Data handling and privacy assessment
              </li>
              <li>
                <CircleCheck size={16} /> Implementation readiness scoring
              </li>
              <li>
                <CircleCheck size={16} /> Risk mitigation recommendations
              </li>
            </ul>
            <div className="assessment_list_header_row">
              <p className="your_assessments_title">YOUR ASSESSMENTS</p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div className="page_tabs" style={{ marginBottom: 0, border: "none", gap: "0.25rem" }}>
                  <button
                    type="button"
                    className={`page_tab ${!showArchivedBuyer ? "page_tab_active" : ""}`}
                    onClick={() => setShowArchivedBuyer(false)}
                  >
                    Current
                  </button>
                  <button
                    type="button"
                    className={`page_tab ${showArchivedBuyer ? "page_tab_active" : ""}`}
                    onClick={() => setShowArchivedBuyer(true)}
                  >
                    Archived
                  </button>
                </div>
                <div className="assessment_search_wrap">
                  <Search size={18} className="assessment_search_icon" aria-hidden />
                  <input
                    type="search"
                    placeholder="Search assessments…"
                    value={assessmentSearch}
                    onChange={(e) => setAssessmentSearch(e.target.value)}
                    className="assessment_search_input"
                    aria-label="Search assessments by name"
                  />
                </div>
              </div>
            </div>
            {loading && <LoadingMessage message="Loading assessments…" />}
            {fetchError && (
              <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>
                {fetchError}
              </p>
            )}
            {!loading && !fetchError && !showArchivedBuyer && (
              <div className="assessment_list_rows">
                {(() => {
                  const q = assessmentSearch.trim().toLowerCase();
                  const filtered = q === "" ? nonExpiredBuyer : nonExpiredBuyer.filter((row) => getAssessmentTitle(row, true).toLowerCase().includes(q));
                  if (filtered.length === 0) return <p className="assessment_search_no_results">{nonExpiredBuyer.length === 0 ? "No assessments yet." : "No assessments match your search."}</p>;
                  return filtered.map((row) => {
                  const isDraft = (row.status || "").toLowerCase() === "draft";
                  const statusLabel = getAssessmentStatusLabel(row);
                  const updatedAtDisplay = formatDateDDMMMYYYY(
                    row.updatedAt ?? row.cotsUpdatedAt ?? row.submittedDate,
                  );
                  const submittedDisplay = isDraft
                    ? updatedAtDisplay
                    : formatDateDDMMMYYYY(row.submittedDate ?? row.updatedAt);
                  const completedBy = getCompletedByDisplay(row) || "—";
                  return (
                    <div key={row.assessmentId} className="vendor_overview_attestation_row">
                      {isDraft && <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_draft" aria-hidden />}
                      {!isDraft && <FileText size={24} className={`vendor_overview_attestation_icon ${statusLabel === "Expired" ? "vendor_overview_attestation_icon_expired" : "vendor_overview_attestation_icon_check"}`} aria-hidden />}
                      <div className="vendor_overview_attestation_content">
                        <p className="vendor_overview_attestation_name">{truncate(getAssessmentDisplayTitle(row, true), 60)}</p>
                        <p className={`vendor_overview_attestation_status_label${isDraft ? " vendor_overview_attestation_status_label_draft" : ""}${statusLabel === "Expired" ? " vendor_overview_attestation_status_label_expired" : ""}`}>
                          {statusLabel}
                        </p>
                        <p className="vendor_overview_attestation_by">
                          {isDraft ? "Updated by:" : "Completed by:"} {completedBy}
                        </p>
                        {isDraft ? (
                          <p className="vendor_overview_attestation_date">
                            Drafted on: {formatDateDDMMMYYYY(row.createdAt)}
                          </p>
                        ) : (
                          <div className="vendor_overview_attestation_date_row">
                            <p className="vendor_overview_attestation_date">
                              Created on: {formatDateDDMMMYYYY(row.createdAt)}
                            </p>
                            <p className="vendor_overview_attestation_date vendor_overview_attestation_date_expiry">
                              Expires on: {formatDateDDMMMYYYY(row.expiryAt)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="vendor_overview_attestation_actions">
                        {isDraft && (
                          <button
                            type="button"
                            className="vendor_overview_btn_view"
                            onClick={() =>
                              navigate(`/buyerAssessment/${row.assessmentId}`)
                            }
                          >
                            <SquarePen size={16} aria-hidden />
                            Edit
                          </button>
                        )}
                        {!isDraft && (
                          <button
                            type="button"
                            className="vendor_overview_btn_view"
                            onClick={() => setPreviewRow(row)}
                          >
                            <Eye size={14} aria-hidden />
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
                })()}
              </div>
            )}
            {!loading && !fetchError && showArchivedBuyer && (
              <div className="assessment_list_rows">
                {(() => {
                  const q = assessmentSearch.trim().toLowerCase();
                  const filtered =
                    q === ""
                      ? archivedBuyerAssessments
                      : archivedBuyerAssessments.filter((row) =>
                          getAssessmentTitle(row, true).toLowerCase().includes(q)
                        );
                  if (filtered.length === 0)
                    return (
                      <p className="assessment_search_no_results">
                        {archivedBuyerAssessments.length === 0
                          ? "No archived assessments."
                          : "No archived assessments match your search."}
                      </p>
                    );
                  return filtered.map((row) => {
                    const completedBy = getCompletedByDisplay(row) || "—";
                    return (
                      <div key={row.assessmentId} className="vendor_overview_attestation_row">
                        <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_expired" aria-hidden />
                        <div className="vendor_overview_attestation_content">
                          <p className="vendor_overview_attestation_name">
                            {truncate(getAssessmentDisplayTitle(row, true), 60)}
                          </p>
                          <p className="vendor_overview_attestation_status_label vendor_overview_attestation_status_label_expired">
                            Expired
                          </p>
                          <p className="vendor_overview_attestation_by">Completed by: {completedBy}</p>
                          <div className="vendor_overview_attestation_date_row">
                            <p className="vendor_overview_attestation_date">
                              Created on: {formatDateDDMMMYYYY(row.createdAt)}
                            </p>
                            <p className="vendor_overview_attestation_date vendor_overview_attestation_date_expiry">
                              Expires on: {formatDateDDMMMYYYY(row.expiryAt)}
                            </p>
                          </div>
                        </div>
                        <div className="vendor_overview_attestation_actions">
                          <button
                            type="button"
                            className="vendor_overview_btn_view vendor_overview_btn_danger"
                            onClick={() => handleDeleteExpired(row.assessmentId)}
                            aria-label="Delete assessment"
                          >
                            <Trash2 size={16} aria-hidden />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {isVendor && (
        <div className="ai_assessments_page">
          <div className="ai_assessments_section">
            <div className="header_cots">
              <div>
                <span>
                  <Target size={24} />
                </span>
              </div>
              <div>
                <h2>COTS Vendor-Side Assessment</h2>

                <p className="section_desc">
                  Assess risks and prepare mitigations for a specific customer
                  opportunity
                </p>
              </div>
            </div>

            <p className="section_desc">Each customer assessment covers:</p>
            <ul className="ai_assessments_checklist">
              <div>
                <li>
                  <CircleCheck size={16} /> Customer discovery and pain points
                </li>
                <li>
                  <CircleCheck size={16} /> Solution fit and implementation
                </li>
                <li>
                  <CircleCheck size={16} /> Risk context and mitigation
                </li>
              </div>
              <div>
                <li>
                  <CircleCheck size={16} /> Customer risk environment
                </li>
                <li>
                  <CircleCheck size={16} /> Tailored risk mitigation
                </li>
                <li>
                  <CircleCheck size={16} />
                  Customer-ready reports
                </li>
              </div>
            </ul>
         
          </div>
          <div className="ai_assessments_section">
            <div className="assessment_list_header_row">
              <p className="your_assessments_title">YOUR ASSESSMENTS</p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div className="page_tabs" style={{ marginBottom: 0, border: "none", gap: "0.25rem" }}>
                  <button
                    type="button"
                    className={`page_tab ${!showArchivedVendor ? "page_tab_active" : ""}`}
                    onClick={() => setShowArchivedVendor(false)}
                  >
                    Current
                  </button>
                  <button
                    type="button"
                    className={`page_tab ${showArchivedVendor ? "page_tab_active" : ""}`}
                    onClick={() => setShowArchivedVendor(true)}
                  >
                    Archived
                  </button>
                </div>
                <div className="assessment_search_wrap">
                  <Search size={18} className="assessment_search_icon" aria-hidden />
                  <input
                    type="search"
                    placeholder="Search assessments…"
                    value={assessmentSearch}
                    onChange={(e) => setAssessmentSearch(e.target.value)}
                    className="assessment_search_input"
                    aria-label="Search assessments by name"
                  />
                </div>
              </div>
            </div>
            {loading && <LoadingMessage message="Loading assessments…" />}
            {fetchError && (
              <p style={{ color: "#dc2626", fontSize: "0.875rem" }}>
                {fetchError}
              </p>
            )}
            {!loading && !fetchError && !showArchivedVendor && (
              <div className="assessment_list_rows">
                {(() => {
                  const q = assessmentSearch.trim().toLowerCase();
                  const filtered = q === "" ? nonExpiredVendor : nonExpiredVendor.filter((row) => getAssessmentTitle(row, false).toLowerCase().includes(q));
                  if (filtered.length === 0) return <p className="assessment_search_no_results">{nonExpiredVendor.length === 0 ? "No vendor assessments yet." : "No assessments match your search."}</p>;
                  return filtered.map((row) => {
                  const isDraft = (row.status || "").toLowerCase() === "draft";
                  const statusLabel = getAssessmentStatusLabel(row);
                  const updatedAtDisplay = formatDateDDMMMYYYY(
                    row.vendorCotsUpdatedAt ?? row.updatedAt,
                  );
                  const submittedDisplay = isDraft
                    ? updatedAtDisplay
                    : formatDateDDMMMYYYY(row.vendorCotsUpdatedAt ?? row.updatedAt);
                  const completedBy = getCompletedByDisplay(row) || "—";
                  return (
                    <div key={row.assessmentId} className="vendor_overview_attestation_row">
                      {isDraft && <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_draft" aria-hidden />}
                      {!isDraft && <FileText size={24} className={`vendor_overview_attestation_icon ${statusLabel === "Expired" ? "vendor_overview_attestation_icon_expired" : "vendor_overview_attestation_icon_check"}`} aria-hidden />}
                      <div className="vendor_overview_attestation_content">
                        <p className="vendor_overview_attestation_name">{truncate(getAssessmentDisplayTitle(row, false), 60)}</p>
                        <p className={`vendor_overview_attestation_status_label${isDraft ? " vendor_overview_attestation_status_label_draft" : ""}${statusLabel === "Expired" ? " vendor_overview_attestation_status_label_expired" : ""}`}>
                          {statusLabel}
                        </p>
                        <p className="vendor_overview_attestation_by">
                          {isDraft ? "Updated by:" : "Completed by:"} {completedBy}
                        </p>
                        {isDraft ? (
                          <p className="vendor_overview_attestation_date">
                            Drafted on: {formatDateDDMMMYYYY(row.createdAt)}
                          </p>
                        ) : (
                          <div className="vendor_overview_attestation_date_row">
                            <p className="vendor_overview_attestation_date">
                              Created on: {formatDateDDMMMYYYY(row.createdAt)}
                            </p>
                            <p className="vendor_overview_attestation_date vendor_overview_attestation_date_expiry">
                              Expires on: {formatDateDDMMMYYYY(row.expiryAt)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="vendor_overview_attestation_actions">
                        {isDraft && (
                          <button
                            type="button"
                            className="vendor_overview_btn_view"
                            onClick={() =>
                              navigate(`/vendorcots/${row.assessmentId}`)
                            }
                          >
                            <SquarePen size={16} aria-hidden />
                            Edit
                          </button>
                        )}
                        {!isDraft && (
                          <button
                            type="button"
                            className="vendor_overview_btn_view"
                            onClick={() => setPreviewRow(row)}
                          >
                            <Eye size={14} aria-hidden />
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  );
                });
                })()}
              </div>
            )}
            {!loading && !fetchError && showArchivedVendor && (
              <div className="assessment_list_rows">
                {(() => {
                  const q = assessmentSearch.trim().toLowerCase();
                  const filtered =
                    q === ""
                      ? archivedVendorAssessments
                      : archivedVendorAssessments.filter((row) =>
                          getAssessmentTitle(row, false).toLowerCase().includes(q)
                        );
                  if (filtered.length === 0)
                    return (
                      <p className="assessment_search_no_results">
                        {archivedVendorAssessments.length === 0
                          ? "No archived assessments."
                          : "No archived assessments match your search."}
                      </p>
                    );
                  return filtered.map((row) => {
                    const completedBy = getCompletedByDisplay(row) || "—";
                    return (
                      <div key={row.assessmentId} className="vendor_overview_attestation_row">
                        <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_expired" aria-hidden />
                        <div className="vendor_overview_attestation_content">
                          <p className="vendor_overview_attestation_name">
                            {truncate(getAssessmentDisplayTitle(row, false), 60)}
                          </p>
                          <p className="vendor_overview_attestation_status_label vendor_overview_attestation_status_label_expired">
                            Expired
                          </p>
                          <p className="vendor_overview_attestation_by">Completed by: {completedBy}</p>
                          <div className="vendor_overview_attestation_date_row">
                            <p className="vendor_overview_attestation_date">
                              Created on: {formatDateDDMMMYYYY(row.createdAt)}
                            </p>
                            <p className="vendor_overview_attestation_date vendor_overview_attestation_date_expiry">
                              Expires on: {formatDateDDMMMYYYY(row.expiryAt)}
                            </p>
                          </div>
                        </div>
                        <div className="vendor_overview_attestation_actions">
                          <button
                            type="button"
                            className="vendor_overview_btn_view vendor_overview_btn_danger"
                            onClick={() => handleDeleteExpired(row.assessmentId)}
                            aria-label="Delete assessment"
                          >
                            <Trash2 size={16} aria-hidden />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {!isBuyer && !isVendor && !isSystemUser && (
        <div className="table_user_page">
          <div className="orgDataTable">
            {loading && <LoadingMessage message="Loading assessments…" />}
            {fetchError && (
              <p style={{ color: "#dc2626", padding: "1rem 0" }}>
                {fetchError}
              </p>
            )}
            {!loading && !fetchError && assessmentsList.length === 0 && (
              <p style={{ color: "#64748b", padding: "1rem 0" }}>
                No assessments yet. Create one using the button above.
              </p>
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

      {previewRow && (
        <div
          className="vendor_attestation_preview_modal_overlay"
          onClick={() => {
            setPreviewRow(null);
            setVendorCotsPreviewDetail(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assessment_preview_modal_title"
        >
          <div
            className="vendor_attestation_preview_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vendor_attestation_preview_modal_header">
              <h2 id="assessment_preview_modal_title">Assessment details</h2>
              <button
                type="button"
                className="modal_close_btn"
                onClick={() => {
                  setPreviewRow(null);
                  setVendorCotsPreviewDetail(null);
                }}
                aria-label="Close"
              >
                <CircleX size={20} />
              </button>
            </div>
            <div className="vendor_attestation_preview_modal_body">
              <div className="vendor_preview">
                <p className="vendor_preview_intro">
                  {previewRow.type === "cots_vendor"
                    ? "Vendor COTS assessment details."
                    : "Buyer COTS assessment details."}
                </p>
                <div className="vendor_preview_sections">
                  {previewRow.type === "cots_vendor" ? (
                    <>
                      {vendorCotsPreviewLoading ? (
                        <LoadingMessage message="Loading assessment details…" />
                      ) : (
                        <>
                          <section className="vendor_preview_card">
                            <h3 className="vendor_preview_card_title">
                              Assessment
                            </h3>
                            <dl className="vendor_preview_list">
                              <div className="vendor_preview_row">
                                <dt className="vendor_preview_label">Type</dt>
                                <dd className="vendor_preview_value">
                                  COTS Vendor
                                </dd>
                              </div>
                              <div className="vendor_preview_row">
                                <dt className="vendor_preview_label">Status</dt>
                                <dd className="vendor_preview_value">
                                  {getAssessmentStatusLabel(vendorCotsPreviewDetail || previewRow)}
                                </dd>
                              </div>
                              <div className="vendor_preview_row">
                                <dt className="vendor_preview_label">
                                  {(vendorCotsPreviewDetail || previewRow)?.status?.toLowerCase() === "draft"
                                    ? "Drafted on"
                                    : "Created on"}
                                </dt>
                                <dd className="vendor_preview_value">
                                  {formatDateDDMMMYYYY(previewRow.createdAt)}
                                </dd>
                              </div>
                              {(vendorCotsPreviewDetail || previewRow)?.status?.toLowerCase() !== "draft" && (
                                <div className="vendor_preview_row">
                                  <dt className="vendor_preview_label">Expires on</dt>
                                  <dd className="vendor_preview_value vendor_preview_value_expiry">
                                    {formatDateDDMMMYYYY(previewRow.expiryAt)}
                                  </dd>
                                </div>
                              )}
                            </dl>
                          </section>
                          <section className="vendor_preview_card">
                            <h3 className="vendor_preview_card_title">
                              Vendor COTS
                            </h3>
                            <dl className="vendor_preview_list">
                              {[
                                {
                                  label: "Customer organization",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "customerOrganizationName",
                                  ),
                                },
                                {
                                  label: "Customer sector",
                                  value: formatSectorForPreview(
                                    getRowPreviewValue(
                                      vendorCotsPreviewDetail || previewRow,
                                      "customerSector",
                                    ),
                                  ),
                                },
                                {
                                  label: "Primary pain point",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "primaryPainPoint",
                                  ),
                                },
                                {
                                  label: "Expected outcomes",
                                  value:
                                    vendorCotsPreviewDetail != null
                                      ? getRowPreviewValue(
                                          vendorCotsPreviewDetail,
                                          "expectedOutcomes",
                                        )
                                      : getRowPreviewValue(
                                          previewRow,
                                          "vendorExpectedOutcomes",
                                        ),
                                },
                                {
                                  label: "Budget range",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "customerBudgetRange",
                                  ),
                                },
                                {
                                  label: "Timeline",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "implementationTimeline",
                                  ),
                                },
                                {
                                  label: "Product name",
                                  value:
                                    (vendorCotsPreviewDetail || previewRow)?.attestationProductName != null &&
                                    String((vendorCotsPreviewDetail || previewRow).attestationProductName).trim() !== ""
                                      ? String((vendorCotsPreviewDetail || previewRow).attestationProductName).trim()
                                      : undefined,
                                },
                                {
                                  label: "Product features",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "productFeatures",
                                  ),
                                },
                                {
                                  label: "Implementation approach",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "implementationApproach",
                                  ),
                                },
                                {
                                  label: "Customization level",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "customizationLevel",
                                  ),
                                },
                                {
                                  label: "Integration complexity",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "integrationComplexity",
                                  ),
                                },
                                {
                                  label: "Regulatory requirements",
                                  value:
                                    vendorCotsPreviewDetail != null
                                      ? getRowPreviewValue(
                                          vendorCotsPreviewDetail,
                                          "regulatoryRequirements",
                                        )
                                      : getRowPreviewValue(
                                          previewRow,
                                          "vendorRegulatoryRequirements",
                                        ),
                                },
                                {
                                  label: "Regulatory requirements (other)",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "regulatoryRequirementsOther",
                                  ),
                                },
                                {
                                  label: "Data sensitivity",
                                  value:
                                    vendorCotsPreviewDetail != null
                                      ? getRowPreviewValue(
                                          vendorCotsPreviewDetail,
                                          "dataSensitivity",
                                        )
                                      : getRowPreviewValue(
                                          previewRow,
                                          "vendorDataSensitivity",
                                        ),
                                },
                                {
                                  label: "Customer risk tolerance",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "customerRiskTolerance",
                                  ),
                                },
                                {
                                  label: "Alternatives considered",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "alternativesConsidered",
                                  ),
                                },
                                {
                                  label: "Key advantages",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "keyAdvantages",
                                  ),
                                },
                                {
                                  label: "Customer-specific risks",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "customerSpecificRisks",
                                  ),
                                },
                                {
                                  label: "Customer-specific risks (other)",
                                  value: getRowPreviewValue(
                                    vendorCotsPreviewDetail || previewRow,
                                    "customerSpecificRisksOther",
                                  ),
                                },
                              ].map(({ label, value }) => (
                                <div key={label} className="vendor_preview_row">
                                  <dt className="vendor_preview_label">
                                    {label}
                                  </dt>
                                  <dd className="vendor_preview_value">
                                    {formatPreviewValue(value, label)}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </section>
                        </>
                      )}
                    </>
                  ) : (
                    ASSESSMENT_PREVIEW_SECTIONS.map((section) => (
                      <section
                        key={section.title}
                        className="vendor_preview_card"
                      >
                        <h3 className="vendor_preview_card_title">
                          {section.title}
                        </h3>
                        <dl className="vendor_preview_list">
                          {section.fields
                            .filter(
                              (field) =>
                                !(
                                  field.label === "Expires on" &&
                                  (previewRow?.status ?? "").toLowerCase() === "draft"
                                )
                            )
                            .map((field) => {
                              const isDraftPreview = (previewRow?.status ?? "").toLowerCase() === "draft";
                              const label =
                                field.label === "Created on" && isDraftPreview ? "Drafted on" : field.label;
                              const isExpiry = field.label === "Expires on";
                              return (
                                <div
                                  key={field.label}
                                  className="vendor_preview_row"
                                >
                                  <dt className="vendor_preview_label">
                                    {label}
                                  </dt>
                                  <dd className={`vendor_preview_value${isExpiry ? " vendor_preview_value_expiry" : ""}`}>
                                    {formatPreviewValue(
                                      field.value(previewRow),
                                      field.label,
                                    )}
                                  </dd>
                                </div>
                              );
                            })}
                        </dl>
                      </section>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Assessments as default };
