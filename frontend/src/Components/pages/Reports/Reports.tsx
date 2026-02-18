import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Search } from "lucide-react"
import ReportCard from "./ReportCard"
import "../UserManagement/user_management.css"
import "./reports.css"

/** Mock report list – replace with API when available */
const MOCK_ASSESSMENT_REPORTS = [
  {
    id: "1",
    title: "AI Vendor Assessment: MedicarAI for Mount Sinai Health System - Full Report",
    meta: "Vendor Assessment Report • 22/1/2026",
    status: "Published",
  },
  {
    id: "2",
    title: "MedicarAI - Vendor Risk Assessment Report",
    meta: "Vendor Assessment Report • 27/1/2026",
    status: "Published",
  },
  {
    id: "3",
    title: "AcmeAnalytics - Vendor Risk Assessment Report",
    meta: "Vendor Assessment Report • 21/11/2025",
    status: "Published",
  },
  {
    id: "4",
    title: "DataForge AI - Vendor Risk Assessment Report",
    meta: "Vendor Assessment Report • 27/1/2026",
    status: "Published",
  },
]

type TabId = "assessment" | "general"

function Reports() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>("assessment")

  const reports = activeTab === "assessment" ? MOCK_ASSESSMENT_REPORTS : []

  const handleSelectReport = (reportId: string) => {
    navigate(`/reports/${reportId}`)
  }

  const handleDownload = (reportId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: trigger PDF download
  }

  return (
    <div className="sec_user_page org_settings_page reports_page">
      <div className="heading_user_page page_header_align">
        <div className="headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <FileText size={24} className="header_icon_svg"/>
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Reports Library</h1>
            <p className="sub_title page_header_subtitle">
              Access completed reports and past assessment analyses.
            </p>
          </div>
        </div>
      </div>

      <div className="reports_tabs">
        <button
          type="button"
          className={`reports_tab ${activeTab === "assessment" ? "reports_tab_active" : ""}`}
          onClick={() => setActiveTab("assessment")}
        >
          Assessment Analysis
        </button>
        <button
          type="button"
          className={`reports_tab ${activeTab === "general" ? "reports_tab_active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          General Reports
        </button>
      </div>

      <div className="reports_search_wrap">
        <Search size={18} className="reports_search_icon" aria-hidden />
        <input
          type="search"
          placeholder="Search reports…"
          className="reports_search_input"
          aria-label="Search reports"
        />
      </div>

      <div className="reports_list">
        {activeTab === "assessment" && reports.length > 0 &&
          reports.map((report) => (
            <ReportCard
              key={report.id}
              reportId={report.id}
              title={report.title}
              meta={report.meta}
              status={report.status}
              onSelect={handleSelectReport}
              onDownload={handleDownload}
            />
          ))}
        {activeTab === "assessment" && reports.length === 0 && (
          <div className="report_detail_empty">
            <h2 className="report_detail_empty_title">No reports yet</h2>
            <p className="report_detail_empty_text">
              There are no completed assessment reports to display. Reports will appear here once assessments are completed and published.
            </p>
          </div>
        )}
        {activeTab === "general" && (
          <div className="report_detail_empty">
            <h2 className="report_detail_empty_title">No general reports yet</h2>
            <p className="report_detail_empty_text">
              General reports will appear here when available.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
