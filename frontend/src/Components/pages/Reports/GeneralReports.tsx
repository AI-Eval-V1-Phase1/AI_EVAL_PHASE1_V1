import React from "react";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "../../UI/Select";
import { Search, CircleX } from "lucide-react";
import Modal from "../../UI/Modal";
import './general_reports.css'
import GeneralReportsTypesPopup, {
  REPORT_TYPE_ERROR,
} from "./GeneralReportsTypesPopup";
import Button from "../../UI/Button";
import GeneralReportsCards from "./GeneralReportsCards";

const BASE_URL =
  import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

const GENERAL_REPORTS_STORAGE_KEY = "generalReports";

function loadStoredReports(): GeneratedReportItem[] {
  try {
    const raw = sessionStorage.getItem(GENERAL_REPORTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GeneratedReportItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredReports(reports: GeneratedReportItem[]) {
  try {
    sessionStorage.setItem(GENERAL_REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // ignore
  }
}

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
  [key: string]: unknown;
}

export interface GeneratedReportItem {
  id: string;
  assessmentId: string;
  assessmentLabel: string;
  reportType: string;
  generatedAt: string;
}

const GeneralReports = () => {
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
  >(loadStoredReports);
  const navigate = useNavigate();

  useEffect(() => {
    saveStoredReports(generatedReports);
  }, [generatedReports]);

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

  const completedVendorAssessments = assessmentsList.filter(
    (a) =>
      (a.type ?? "").toLowerCase() === "cots_vendor" &&
      (a.status ?? "").toLowerCase() !== "draft",
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

  const handleGenerateReport = (reportType: string) => {
    const assessmentId = assessmentIdForReport.trim();
    const alreadyExists = generatedReports.some(
      (r) => r.assessmentId === assessmentId && r.reportType === reportType,
    );
    if (alreadyExists) {
      setAlreadyGeneratedError(
        "This report is already generated. You can generate another type of report.",
      );
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
    const content = [
      "General Report",
      "—",
      `Assessment: ${report.assessmentLabel}`,
      `Report type: ${report.reportType}`,
      `Generated: ${dateStr}`,
      "",
      "This report was generated from the Reports Library. Full report content can be viewed in the application.",
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
            <Button className="user_cancel_btn" onClick={handleCloseModal}>
              <span>
                <CircleX />
              </span>
            </Button>
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
          onGenerateReport={handleGenerateReport}
          alreadyGeneratedError={alreadyGeneratedError}
        />
      </Modal>
      <section>
        <GeneralReportsCards
          reports={generatedReports}
          onViewReport={handleViewReport}
          onDownload={handleDownloadReport}
        />
      </section>
    </>
  );
};

export default GeneralReports;
