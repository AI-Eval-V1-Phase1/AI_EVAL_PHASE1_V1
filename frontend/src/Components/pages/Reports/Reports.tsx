import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Search } from "lucide-react";
import { formatDateDDMMMYYYY } from "../../../utils/formatDate.js";
import ReportCard from "./ReportCard";
import "../../../styles/page_tabs.css";
import "../UserManagement/user_management.css";
import "./reports.css";
import GeneralReports from "./GeneralReports.js";

const BASE_URL =
  import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

export interface CustomerRiskReportItem {
  id: string;
  assessmentId: string;
  title: string;
  report: Record<string, unknown>;
  createdAt: string;
  expiryAt?: string | null;
}

type TabId = "assessment" | "general";

/** Report cards: display only org name and product name (strip "Analysis Report: " prefix) */
function getReportCardTitle(fullTitle: string): string {
  if (!fullTitle || typeof fullTitle !== "string") return fullTitle || "—";
  const stripped = fullTitle.replace(/^Analysis Report:\s*/i, "").trim();
  return stripped || fullTitle;
}

function formatReportMeta(createdAt: string): string {
  if (!createdAt) return "Analysis Report";
  const dateStr = formatDateDDMMMYYYY(createdAt);
  return dateStr === "—" ? "Analysis Report" : `Analysis Report • ${dateStr}`;
}

function Reports() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("assessment");
  const [reports, setReports] = useState<CustomerRiskReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "AI Eval | Reports";
    return () => {
      document.title = "AI Eval";
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "assessment") return;
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setLoading(false);
      setReports([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/customerRiskReports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data?.data?.reports)) {
          setReports(data.data.reports);
        } else {
          setReports([]);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load reports");
        setReports([]);
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleSelectReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleDownload = (reportId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: trigger PDF download
  };

  const handleDeleteReport = (reportId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;
    fetch(`${BASE_URL}/customerRiskReports/${encodeURIComponent(reportId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setReports((prev) => prev.filter((r) => r.id !== reportId));
        }
      })
      .catch(() => {});
  };

  const assessmentReports = activeTab === "assessment" ? reports : [];

  return (
    <div className="sec_user_page org_settings_page reports_page">
      <div className="heading_user_page page_header_align">
        <div className="headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <FileText size={24} className="header_icon_svg" />
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Reports Library</h1>
            <p className="sub_title page_header_subtitle">
              Access completed reports and past assessment analyses.
            </p>
          </div>
        </div>
      </div>
      <div className="reports_tabs_section">
        <div className="page_tabs">
          <button
            type="button"
            className={`page_tab ${activeTab === "assessment" ? "page_tab_active" : ""}`}
            onClick={() => setActiveTab("assessment")}
          >
            Complete Reports
          </button>
          <button
            type="button"
            className={`page_tab ${activeTab === "general" ? "page_tab_active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            Assessment Analysis
          </button>
        </div>
        <div className="reports_search_wrap reports_search_input">
          <Search size={18} className="reports_search_icon" aria-hidden />
          <input
            type="search"
            placeholder="Search reports…"
            className="reports_search_input"
            aria-label="Search reports"
          />
        </div>
      </div>

      <div className="reports_list">
        {activeTab === "assessment" && loading && (
          <div className="report_detail_empty">
            <p className="report_detail_empty_text">Loading reports…</p>
          </div>
        )}
        {activeTab === "assessment" && !loading && error && (
          <div className="report_detail_empty">
            <h2 className="report_detail_empty_title">Error loading reports</h2>
            <p className="report_detail_empty_text">{error}</p>
          </div>
        )}
        {activeTab === "assessment" &&
          !loading &&
          !error &&
          assessmentReports.length > 0 &&
          assessmentReports.map((report) => {
            const expiryFormatted =
              report.expiryAt != null && String(report.expiryAt).trim() !== ""
                ? formatDateDDMMMYYYY(report.expiryAt)
                : null;
            const expiryAt = report.expiryAt;
            const isExpired =
              expiryAt != null &&
              String(expiryAt).trim() !== "" &&
              !Number.isNaN(new Date(expiryAt).getTime()) &&
              new Date(expiryAt).setHours(0, 0, 0, 0) <
                new Date().setHours(0, 0, 0, 0);
            return (
              <ReportCard
                key={report.id}
                reportId={report.id}
                title={getReportCardTitle(report.title)}
                meta={formatReportMeta(report.createdAt)}
                expiry={expiryFormatted !== "—" ? expiryFormatted : undefined}
                archived={isExpired}
                onSelect={handleSelectReport}
                onDownload={handleDownload}
                onDelete={handleDeleteReport}
              />
            );
          })}
        {activeTab === "assessment" &&
          !loading &&
          !error &&
          assessmentReports.length === 0 && (
            <div className="report_detail_empty">
              <h2 className="report_detail_empty_title">No reports yet</h2>
              <p className="report_detail_empty_text">
                There are no completed assessment reports to display. Reports
                will appear here once assessments are completed and published.
              </p>
            </div>
          )}
        {activeTab === "general" && (
          <div className="reports_list">
          {activeTab === "general" && <GeneralReports />}
        </div>
        )}

        {/* <div className="report_detail_empty">
            <h2 className="report_detail_empty_title">
              No general reports yet
            </h2>
            <p className="report_detail_empty_text">
              General reports will appear here when available.
            </p>
          </div> */}
        
      </div>
    </div>
  );
}

export default Reports;
