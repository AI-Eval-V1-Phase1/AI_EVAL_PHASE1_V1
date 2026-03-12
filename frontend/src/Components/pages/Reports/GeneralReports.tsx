import React from "react";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "../../UI/Select";
import { Search, CircleX, Loader2 } from "lucide-react";
import Modal from "../../UI/Modal";
import './general_reports.css'
import GeneralReportsTypesPopup, {
  REPORT_TYPE_ERROR,
} from "./GeneralReportsTypesPopup";
import Button from "../../UI/Button";
import GeneralReportsCards from "./GeneralReportsCards";
import { ReportsPagination } from "./ReportsPagination";
import "../VendorAttestations/vendor_attestation_preview.css";

const BASE_URL =
  import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

interface AssessmentRow {
  assessmentId: number;
  type: string;
  status: string;
  organizationId?: string | null;
  vendorAttestationId?: string | null;
  vendorProductName?: string | null;
  productName?: string | null;
  vendorName?: string | null;
  customerOrganizationName?: string | null;
  customerSector?: string | null;
  product_in_scope?: string | null;
  productInScope?: string | null;
  expiryAt?: string | null;
  /** When in the past, linked attestation is expired (exclude from dropdown). */
  attestationExpiryAt?: string | null;
  [key: string]: unknown;
}

function isAssessmentExpired(row: AssessmentRow): boolean {
  const expiryAt = row.expiryAt;
  if (expiryAt == null || String(expiryAt).trim() === "") return false;
  const expiry = new Date(expiryAt);
  if (Number.isNaN(expiry.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return expiry.getTime() < today.getTime();
}

function isAttestationExpired(row: AssessmentRow): boolean {
  const attestationExpiryAt = row.attestationExpiryAt;
  if (attestationExpiryAt == null || String(attestationExpiryAt).trim() === "") return false;
  const expiry = new Date(attestationExpiryAt);
  if (Number.isNaN(expiry.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return expiry.getTime() < today.getTime();
}

export interface GeneratedReportItem {
  id: string;
  assessmentId: string;
  assessmentLabel: string;
  reportType: string;
  generatedAt: string;
  /** For Executive Stakeholder Brief: generated content (sections 16–21). */
  briefContent?: string;
  /** When in the past, report is archived (assessment expired). */
  expiryAt?: string | null;
  /** When in the past, report is archived (linked attestation expired). */
  attestationExpiryAt?: string | null;
}

function isGeneralReportArchived(report: GeneratedReportItem): boolean {
  const expiryAt = report.expiryAt;
  const attestationExpiryAt = report.attestationExpiryAt;
  const isAssessmentExpired =
    expiryAt != null &&
    String(expiryAt).trim() !== "" &&
    !Number.isNaN(new Date(expiryAt).getTime()) &&
    new Date(expiryAt).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  const isAttestationExpired =
    attestationExpiryAt != null &&
    String(attestationExpiryAt).trim() !== "" &&
    !Number.isNaN(new Date(attestationExpiryAt).getTime()) &&
    new Date(attestationExpiryAt).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  return isAssessmentExpired || isAttestationExpired;
}

interface GeneralReportsProps {
  /** Search filter from Reports page (org name, product name, published, archived). */
  searchQuery?: string;
  /** When true, show only archived reports; when false, only current; when undefined, show all (filter by search). */
  showArchivedOnly?: boolean;
  /** When true, hide the "Select a vendor assessment" dropdown (e.g. on Archived tab). */
  hideDropdown?: boolean;
  /** When set (e.g. on Archived tab), use this page size and show pagination for archived list. */
  archivedPageSize?: number;
  /** When true and showArchivedOnly, do not render list/pagination here; parent renders combined list. */
  renderArchivedListOnly?: boolean;
  /** When showArchivedOnly and renderArchivedListOnly, called with the archived general reports list for parent to combine. */
  onArchivedReportsChange?: (reports: GeneratedReportItem[]) => void;
  /** When false, hide the assessment dropdown and report generation (e.g. System Manager / System Viewer view-only). */
  canGenerateReports?: boolean;
}

const GeneralReports = ({ searchQuery = "", showArchivedOnly, hideDropdown, archivedPageSize, renderArchivedListOnly, onArchivedReportsChange, canGenerateReports = true }: GeneralReportsProps) => {
  const [loading, setLoading] = useState(true);
  const [assessmentsList, setAssessmentsList] = useState<AssessmentRow[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("");
  const [isTypeReportPopupOpen, setIsTypeReportPopupOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [reportError, setReportError] = useState("");
  const [assessmentIdForReport, setAssessmentIdForReport] = useState("");
  const [alreadyGeneratedError, setAlreadyGeneratedError] = useState("");
  const [generatedReports, setGeneratedReports] = useState<
    GeneratedReportItem[]
  >([]);
  const [briefGenerating, setBriefGenerating] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const [generalReportsPage, setGeneralReportsPage] = useState(1);
  const [generalReportsPageSize, setGeneralReportsPageSize] = useState(10);
  const navigate = useNavigate();

  const archivedGeneralList = React.useMemo(() => {
    if (!showArchivedOnly) return [];
    let list = generatedReports.filter((r) => isGeneralReportArchived(r));
    const q = searchQuery.trim().toLowerCase();
    if (q === "published") list = list.filter((r) => !isGeneralReportArchived(r));
    else if (q === "archived") list = list.filter((r) => isGeneralReportArchived(r));
    else if (q) {
      list = list.filter((r) => {
        const label = (r.assessmentLabel ?? "").toLowerCase();
        const reportType = (r.reportType ?? "").toLowerCase();
        return label.includes(q) || reportType.includes(q);
      });
    }
    return list;
  }, [showArchivedOnly, generatedReports, searchQuery]);

  useEffect(() => {
    if (showArchivedOnly && onArchivedReportsChange) {
      onArchivedReportsChange(archivedGeneralList);
    }
  }, [showArchivedOnly, onArchivedReportsChange, archivedGeneralList]);

  useEffect(() => {
    setGeneralReportsPage(1);
  }, [searchQuery, showArchivedOnly]);

  function getVendorAssessmentLabel(a: AssessmentRow): string {
    const org = (a.customerOrganizationName ?? "").toString().trim();
    const productInScope = (a.product_in_scope ?? a.productInScope ?? "")
      .toString()
      .trim();
    if (org && productInScope) return `${org} and ${productInScope}`;
    if (org) return org;
    if (productInScope) return productInScope;
    const product = (a.productName ?? "").toString().trim();
    const vendor = (a.vendorName ?? "").toString().trim();
    if (product && vendor) return `${product} – ${vendor}`;
    if (product) return product;
    if (vendor) return vendor;
    return `Vendor assessment #${a.assessmentId}`;
  }

  // The below code is to fetch the assessments
  const fetchAssessments = useCallback(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setLoading(false);
      return;
    }
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
        if (result?.data?.assessments != null) {
          setAssessmentsList(result.data.assessments as AssessmentRow[]);
        } else {
          setAssessmentsList([]);
        }
      })
      .catch(() => setAssessmentsList([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  // Load general reports from DB (stored with assessment_id, created_at, created_by)
  useEffect(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setLoading(false);
      return;
    }
    const systemRole = (sessionStorage.getItem("systemRole") ?? "").toLowerCase().trim().replace(/_/g, " ");
    const organizationId = (sessionStorage.getItem("organizationId") ?? "").trim();
    const isSystemManagerOrViewer = systemRole === "system manager" || systemRole === "system viewer";
    const query = isSystemManagerOrViewer && organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
    fetch(`${BASE_URL}/generalReports${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data?.data?.reports)) {
          const list = data.data.reports.map((r: { id: string; assessmentId: string; assessmentLabel?: string; reportType: string; generatedAt: string; briefContent?: string; expiryAt?: string | null; attestationExpiryAt?: string | null }) => ({
            id: r.id,
            assessmentId: r.assessmentId,
            assessmentLabel: r.assessmentLabel ?? "",
            reportType: r.reportType,
            generatedAt: r.generatedAt,
            briefContent: r.briefContent,
            expiryAt: r.expiryAt ?? null,
            attestationExpiryAt: r.attestationExpiryAt ?? null,
          }));
          setGeneratedReports(list);
        }
      })
      .catch(() => setGeneratedReports([]));
  }, []);

  const completedVendorAssessments = assessmentsList.filter(
    (a) =>
      (a.type ?? "").toLowerCase() === "cots_vendor" &&
      (a.status ?? "").toLowerCase() !== "draft" &&
      !isAssessmentExpired(a) &&
      !isAttestationExpired(a),
  );

  // Dropdown label: "Org Name - Product Name" (customer org + attestation product name from API)
  const selectOptions = completedVendorAssessments.map((a) => {
    const orgName = (a.customerOrganizationName ?? "").toString().trim();
    const productName = (a.vendorProductName ?? a.productName ?? "").toString().trim();
    const label =
      orgName && productName
        ? `${orgName} - ${productName}`
        : productName || orgName || getVendorAssessmentLabel(a);
    return {
      value: String(a.assessmentId),
      label,
    };
  });

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAssessmentIdForReport(value);
    setSelectedAssessmentId("");
    setReportError("");
    setIsTypeReportPopupOpen(true);
  };

  const handleCloseModal = () => {
    if (!selectedReportType.trim()) {
      setReportError(REPORT_TYPE_ERROR);
    }
    setSelectedReportType("");
    setAssessmentIdForReport("");
    setAlreadyGeneratedError("");
    setIsTypeReportPopupOpen(false);
  };

  /** Same "already generated" message used for all report types. */
  const ALREADY_GENERATED_MSG =
    "This report is already generated. You can generate another type of report.";

  /** For already-exists check: "Qualification" is legacy for "Sales Qualification Report". */
  const reportTypeMatches = (stored: string, selected: string): boolean => {
    if (stored === selected) return true;
    if (
      (stored === "Qualification" || stored === "Sales Qualification Report") &&
      (selected === "Qualification" || selected === "Sales Qualification Report")
    )
      return true;
    return false;
  };

  const handleGenerateReport = async (reportType: string) => {
    const assessmentId = assessmentIdForReport.trim();
    if (reportType === "Executive Stakeholder Brief") {
      const alreadyExists = generatedReports.some(
        (r) => r.assessmentId === assessmentId && r.reportType === reportType,
      );
      if (alreadyExists) {
        setAlreadyGeneratedError(ALREADY_GENERATED_MSG);
        return;
      }
      setReportError("");
      setAlreadyGeneratedError("");
      setBriefError(null);
      setSelectedReportType("");
      setIsTypeReportPopupOpen(false);
      setBriefGenerating(true);
      const token = sessionStorage.getItem("bearerToken");
      if (!token) {
        setBriefError("Please log in to generate the brief.");
        setBriefGenerating(false);
        return;
      }
      const option = selectOptions.find((o) => o.value === assessmentId);
      const assessmentLabel = option?.label ?? `Assessment ${assessmentId}`;
      try {
        const res = await fetch(`${BASE_URL}/executiveStakeholderBrief`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assessmentId, assessmentLabel }),
        });
        const data = await res.json();
        if (data?.success && data?.data?.report) {
          const report = data.data.report;
          const newReport: GeneratedReportItem = {
            id: report.id,
            assessmentId: report.assessmentId,
            assessmentLabel: report.assessmentLabel ?? assessmentLabel,
            reportType: report.reportType,
            generatedAt: report.generatedAt,
            briefContent: report.briefContent,
          };
          setGeneratedReports((prev) => [...prev, newReport]);
        } else {
          setBriefError(data?.message ?? "Failed to generate Executive Stakeholder Brief.");
        }
      } catch {
        setBriefError("Failed to generate Executive Stakeholder Brief. Please try again.");
      } finally {
        setBriefGenerating(false);
        setAssessmentIdForReport("");
      }
      return;
    }
    if (reportType === "Sales Qualification Report") {
      const alreadyExists = generatedReports.some(
        (r) =>
          r.assessmentId === assessmentId &&
          reportTypeMatches(r.reportType, reportType),
      );
      if (alreadyExists) {
        setAlreadyGeneratedError(ALREADY_GENERATED_MSG);
        return;
      }
      setReportError("");
      setAlreadyGeneratedError("");
      setSelectedReportType("");
      setIsTypeReportPopupOpen(false);
      setBriefGenerating(true);
      const token = sessionStorage.getItem("bearerToken");
      if (!token) {
        setBriefError("Please log in to generate the report.");
        setBriefGenerating(false);
        return;
      }
      const option = selectOptions.find((o) => o.value === assessmentId);
      const assessmentLabel = option?.label ?? `Assessment ${assessmentId}`;
      try {
        const res = await fetch(`${BASE_URL}/salesQualificationReport`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assessmentId, assessmentLabel }),
        });
        const data = await res.json();
        if (data?.success && data?.data?.report) {
          const report = data.data.report;
          const newReport: GeneratedReportItem = {
            id: report.id,
            assessmentId: report.assessmentId,
            assessmentLabel: report.assessmentLabel ?? assessmentLabel,
            reportType: report.reportType,
            generatedAt: report.generatedAt,
            briefContent: report.briefContent,
          };
          setGeneratedReports((prev) => [...prev, newReport]);
        } else {
          const msg = data?.message ?? "";
          const isAlreadyGenerated =
            typeof msg === "string" &&
            /already\s+(generated|exists?)/i.test(msg.trim());
          if (isAlreadyGenerated) {
            setAlreadyGeneratedError(ALREADY_GENERATED_MSG);
            setIsTypeReportPopupOpen(true);
          } else {
            setBriefError(msg || "Failed to generate Sales Qualification Report.");
          }
        }
      } catch {
        setBriefError("Failed to generate Sales Qualification Report. Please try again.");
      } finally {
        setBriefGenerating(false);
        setAssessmentIdForReport("");
      }
      return;
    }
    if (reportType === "Customer Risk Mitigation Plan") {
      const alreadyExists = generatedReports.some(
        (r) => r.assessmentId === assessmentId && r.reportType === reportType,
      );
      if (alreadyExists) {
        setAlreadyGeneratedError(ALREADY_GENERATED_MSG);
        return;
      }
      setReportError("");
      setAlreadyGeneratedError("");
      setSelectedReportType("");
      setIsTypeReportPopupOpen(false);
      setBriefGenerating(true);
      const token = sessionStorage.getItem("bearerToken");
      if (!token) {
        setBriefError("Please log in to generate the report.");
        setBriefGenerating(false);
        return;
      }
      const option = selectOptions.find((o) => o.value === assessmentId);
      const assessmentLabel = option?.label ?? `Assessment ${assessmentId}`;
      try {
        const res = await fetch(`${BASE_URL}/customerRiskMitigationPlan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assessmentId, assessmentLabel }),
        });
        const data = await res.json();
        if (data?.success && data?.data?.report) {
          const report = data.data.report;
          const newReport: GeneratedReportItem = {
            id: report.id,
            assessmentId: report.assessmentId,
            assessmentLabel: report.assessmentLabel ?? assessmentLabel,
            reportType: report.reportType,
            generatedAt: report.generatedAt,
            briefContent: report.briefContent,
          };
          setGeneratedReports((prev) => [...prev, newReport]);
        } else {
          setBriefError(data?.message ?? "Failed to generate Customer Risk Mitigation Plan.");
        }
      } catch {
        setBriefError("Failed to generate Customer Risk Mitigation Plan. Please try again.");
      } finally {
        setBriefGenerating(false);
        setAssessmentIdForReport("");
      }
      return;
    }
    if (reportType === "Implementation Roadmap Proposal") {
      const alreadyExists = generatedReports.some(
        (r) => r.assessmentId === assessmentId && r.reportType === reportType,
      );
      if (alreadyExists) {
        setAlreadyGeneratedError(ALREADY_GENERATED_MSG);
        return;
      }
      setReportError("");
      setAlreadyGeneratedError("");
      setSelectedReportType("");
      setIsTypeReportPopupOpen(false);
      setBriefGenerating(true);
      const token = sessionStorage.getItem("bearerToken");
      if (!token) {
        setBriefError("Please log in to generate the report.");
        setBriefGenerating(false);
        return;
      }
      const option = selectOptions.find((o) => o.value === assessmentId);
      const assessmentLabel = option?.label ?? `Assessment ${assessmentId}`;
      try {
        const res = await fetch(`${BASE_URL}/implementationRoadmapProposal`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ assessmentId, assessmentLabel }),
        });
        const data = await res.json();
        if (data?.success && data?.data?.report) {
          const report = data.data.report;
          const newReport: GeneratedReportItem = {
            id: report.id,
            assessmentId: report.assessmentId,
            assessmentLabel: report.assessmentLabel ?? assessmentLabel,
            reportType: report.reportType,
            generatedAt: report.generatedAt,
            briefContent: report.briefContent,
          };
          setGeneratedReports((prev) => [...prev, newReport]);
        } else {
          setBriefError(data?.message ?? "Failed to generate Implementation Roadmap Proposal.");
        }
      } catch {
        setBriefError("Failed to generate Implementation Roadmap Proposal. Please try again.");
      } finally {
        setBriefGenerating(false);
        setAssessmentIdForReport("");
      }
      return;
    }
    const alreadyExists = generatedReports.some(
      (r) => r.assessmentId === assessmentId && r.reportType === reportType,
    );
    if (alreadyExists) {
      setAlreadyGeneratedError(ALREADY_GENERATED_MSG);
      return;
    }
    setReportError("");
    setAlreadyGeneratedError("");
    setSelectedReportType("");
    setIsTypeReportPopupOpen(false);
    const option = selectOptions.find((o) => o.value === assessmentId);
    const assessmentLabel = option?.label ?? `Assessment ${assessmentId}`;
    const newReport: GeneratedReportItem = {
      id: `gr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      assessmentId,
      assessmentLabel,
      reportType,
      generatedAt: new Date().toISOString(),
    };
    setGeneratedReports((prev) => [...prev, newReport]);
    setAssessmentIdForReport("");
  };

  const handleViewReport = (report: GeneratedReportItem) => {
    navigate(`/reports/general/${encodeURIComponent(report.id)}`);
  };

  const handleDownloadReport = (report: GeneratedReportItem) => {
    const formatDate = (iso: string) => {
      try {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "—";
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/\s+/g, "-");
      } catch {
        return "—";
      }
    };
    const sanitize = (s: string) =>
      s.replace(/[<>:"/\\|?*]/g, "").replace(/\s+/g, "-").slice(0, 80);
    const dateStr = formatDate(report.generatedAt);
    const bodyContent = report.briefContent ?? "This report was generated from the Reports Library. Full report content can be viewed in the application.";
    const content = [
      "General Report",
      "—",
      `Assessment: ${report.assessmentLabel}`,
      `Report type: ${report.reportType}`,
      `Generated: ${dateStr}`,
      "",
      bodyContent,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitize(report.assessmentLabel)}-${sanitize(report.reportType)}-${dateStr.replace(/\//g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {!hideDropdown && canGenerateReports && (
        <section className="general_reports_section_one">
          <div className="gen_reports_assessment_select">
            <Select
              id="vendor_assessment"
              name="vendor_assessment"
              labelName=""
              value={selectedAssessmentId}
              default_option="Select a vendor assessment"
              options={selectOptions}
              onChange={handleSelectChange}
            />
          </div>
          {/* <div className="search_align_right">
          <div className="gen_reports_search_wrap">
            <Search size={18} className="reports_search_icon" aria-hidden />
            <input
              type="search"
              placeholder="Search reports…"
              className="reports_search_input"
              aria-label="Search reports"
            />
          </div>
        </div> */}
        </section>
      )}
      {/* {reportError && (
        <p className="general_reports_page_error" role="alert">
          {reportError}
        </p>
      )} */}
      <Modal isOpen={isTypeReportPopupOpen} onClose={handleCloseModal} modalPopupClassName="reports_type_popup">
        <div className="header_modal">
          <div>
            <h2 className="modal_popup_title">Report Type</h2>
            <p className="modal_sub_title">
              Select a report type for the chosen assessment.
            </p>
          </div>
          <div className="cancel">
            <button
              type="button"
              className="modal_close_btn"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <CircleX size={20} />
            </button>
          </div>
        </div>
        <GeneralReportsTypesPopup
          selectedReport={selectedReportType}
          onReportTypeChange={(value) => {
            setSelectedReportType(value);
            setAlreadyGeneratedError("");
          }}
          onClose={() => {
            setReportError("");
            setSelectedReportType("");
            setAlreadyGeneratedError("");
            setIsTypeReportPopupOpen(false);
          }}
          onGenerateReport={canGenerateReports ? handleGenerateReport : undefined}
          alreadyGeneratedError={alreadyGeneratedError}
        />
      </Modal>
      {briefError && (
        <p className="general_reports_page_error" role="alert">
          {briefError}
        </p>
      )}
      {briefGenerating && (
        <div
          className="vendor_attestation_submit_overlay"
          role="status"
          aria-live="polite"
          aria-label="Generating report"
        >
          <div className="vendor_attestation_submit_overlay_content">
            <Loader2 size={32} className="vendor_attestation_submit_overlay_loader" aria-hidden />
            <p>Generating report…</p>
            <p className="vendor_attestation_submit_overlay_hint">Please wait. Do not close or refresh.</p>
          </div>
        </div>
      )}
      <section>
        {showArchivedOnly && renderArchivedListOnly ? null : (() => {
          /** Apply tab filter: only current, only archived, or all (when undefined). */
          let filteredList = generatedReports;
          if (showArchivedOnly === true) {
            filteredList = filteredList.filter((r) => isGeneralReportArchived(r));
          } else if (showArchivedOnly === false) {
            filteredList = filteredList.filter((r) => !isGeneralReportArchived(r));
          }
          const q = searchQuery.trim().toLowerCase();
          if (q === "published") {
            filteredList = filteredList.filter((r) => !isGeneralReportArchived(r));
          } else if (q === "archived") {
            filteredList = filteredList.filter((r) => isGeneralReportArchived(r));
          } else if (q) {
            filteredList = filteredList.filter((r) => {
              const label = (r.assessmentLabel ?? "").toLowerCase();
              const reportType = (r.reportType ?? "").toLowerCase();
              return label.includes(q) || reportType.includes(q);
            });
          }
          const pageSize = showArchivedOnly && archivedPageSize != null ? archivedPageSize : generalReportsPageSize;
          const start = (generalReportsPage - 1) * pageSize;
          const paginatedList = filteredList.slice(start, start + pageSize);
          return (
            <>
              <GeneralReportsCards
                reports={paginatedList}
                onViewReport={handleViewReport}
                onDownload={showArchivedOnly ? undefined : handleDownloadReport}
              />
              <ReportsPagination
                totalItems={filteredList.length}
                currentPage={generalReportsPage}
                pageSize={pageSize}
                onPageChange={setGeneralReportsPage}
                onPageSizeChange={
                  showArchivedOnly && archivedPageSize != null
                    ? undefined
                    : (size) => {
                        setGeneralReportsPageSize(size);
                        setGeneralReportsPage(1);
                      }
                }
              />
            </>
          );
        })()}
      </section>
    </>
  );
};

export default GeneralReports;
