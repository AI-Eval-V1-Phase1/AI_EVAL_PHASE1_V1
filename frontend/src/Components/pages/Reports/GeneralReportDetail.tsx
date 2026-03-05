import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleChevronLeft, Download } from "lucide-react";
import "../UserManagement/user_management.css";
import "./reports.css";

const GENERAL_REPORTS_STORAGE_KEY = "generalReports";

interface GeneratedReportItem {
  id: string;
  assessmentId: string;
  assessmentLabel: string;
  reportType: string;
  generatedAt: string;
}

function loadReportById(reportId: string): GeneratedReportItem | null {
  try {
    const raw = sessionStorage.getItem(GENERAL_REPORTS_STORAGE_KEY);
    if (!raw) return null;
    const list = JSON.parse(raw) as GeneratedReportItem[];
    if (!Array.isArray(list)) return null;
    return list.find((r) => r.id === reportId) ?? null;
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/\s+/g, "-");
  } catch {
    return "—";
  }
}

function sanitizeFileName(s: string): string {
  return s.replace(/[<>:"/\\|?*]/g, "").replace(/\s+/g, "-").slice(0, 80);
}

function GeneralReportDetail() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<GeneratedReportItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = reportId?.trim();
    if (!id) {
      setNotFound(true);
      return;
    }
    const found = loadReportById(id);
    if (found) {
      setReport(found);
      setNotFound(false);
    } else {
      setReport(null);
      setNotFound(true);
    }
  }, [reportId]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/reports", { state: { tab: "general" } });
  };

  const handleDownload = () => {
    if (!report) return;
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
    a.download = `${sanitizeFileName(report.assessmentLabel)}-${sanitizeFileName(report.reportType)}-${dateStr.replace(/\//g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (notFound || !report) {
    return (
      <div className="sec_user_page org_settings_page reports_page report_detail_page report_detail_type_general">
        <div className="report_detail_empty">
          <h2 className="report_detail_empty_title">Report not found</h2>
          <p className="report_detail_empty_text">
            This report does not exist or may have been cleared. Return to the
            Reports Library to generate a new report.
          </p>
          <a
            href="/reports"
            className="report_assessment_back report_detail_empty_back"
            onClick={(e) => {
              e.preventDefault();
              navigate("/reports", { state: { tab: "general" } });
            }}
          >
            <CircleChevronLeft size={20} />
            Back to Reports
          </a>
        </div>
      </div>
    );
  }

  const generatedDate = formatDate(report.generatedAt);

  return (
    <div className="sec_user_page org_settings_page reports_page report_detail_page report_detail_full report_detail_type_general">
      <header className="report_assessment_header">
        <a
          href="/reports"
          className="report_assessment_back"
          onClick={handleBack}
        >
          <CircleChevronLeft size={20} />
          Back to Reports
        </a>
        <div className="report_assessment_title_row">
          <h1 className="report_detail_title report_assessment_title">{report.reportType}</h1>
          <button
            type="button"
            className="report_detail_export_btn"
            onClick={handleDownload}
            aria-label="Download report"
          >
            <Download size={18} aria-hidden />
            Download
          </button>
        </div>
        <p className="report_assessment_subtitle report_detail_subtitle">
          {report.assessmentLabel} • {generatedDate}
        </p>
      </header>
{/* 
      <section className="report_section_card general_report_info_card">
        <h2 className="report_section_heading">Report information</h2>
        <dl className="report_detail_dl report_detail_info_grid">
          <div className="report_detail_row">
            <dt className="report_detail_dt">Vendor assessment</dt>
            <dd className="report_detail_dd">{report.assessmentLabel}</dd>
          </div>
          <div className="report_detail_row">
            <dt className="report_detail_dt">Report type</dt>
            <dd className="report_detail_dd">{report.reportType}</dd>
          </div>
          <div className="report_detail_row">
            <dt className="report_detail_dt">Generated date</dt>
            <dd className="report_detail_dd">{generatedDate}</dd>
          </div>
          <div className="report_detail_row">
            <dt className="report_detail_dt">Status</dt>
            <dd className="report_detail_dd">
              <span className="report_status_badge report_status_completed">
                Generated
              </span>
            </dd>
          </div>
        </dl>
      </section> */}

      <section className="report_section_card">
        <h2 className="report_section_heading">Summary</h2>
        <p className="report_summary_body">
          This is a general report generated for the selected vendor
          assessment. Use the Download button above to save a copy. For
          assessment-specific risk reports, use the Assessment Analysis tab in
          the Reports Library.
        </p>
      </section>
    </div>
  );
}

export default GeneralReportDetail;
