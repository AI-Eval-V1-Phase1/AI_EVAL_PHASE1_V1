import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Search } from "lucide-react"
import ReportCard from "./ReportCard"
import "../UserManagement/user_management.css"
import "./reports.css"

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1"

export interface CustomerRiskReportItem {
  id: string
  assessmentId: string
  title: string
  report: Record<string, unknown>
  createdAt: string
}

type TabId = "assessment" | "general"

function formatReportMeta(createdAt: string): string {
  if (!createdAt) return "Customer Risk Assessment"
  try {
    const d = new Date(createdAt)
    if (Number.isNaN(d.getTime())) return "Customer Risk Assessment"
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    return `Customer Risk Assessment • ${day}/${month}/${year}`
  } catch {
    return "Customer Risk Assessment"
  }
}

function Reports() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>("assessment")
  const [reports, setReports] = useState<CustomerRiskReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeTab !== "assessment") return
    const token = sessionStorage.getItem("bearerToken")
    if (!token) {
      setLoading(false)
      setReports([])
      return
    }
    setLoading(true)
    setError(null)
    fetch(`${BASE_URL}/customerRiskReports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data?.data?.reports)) {
          setReports(data.data.reports)
        } else {
          setReports([])
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load reports")
        setReports([])
      })
      .finally(() => setLoading(false))
  }, [activeTab])

  const handleSelectReport = (reportId: string) => {
    navigate(`/reports/${reportId}`)
  }

  const handleDownload = (reportId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: trigger PDF download
  }

  const assessmentReports = activeTab === "assessment" ? reports : []

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
        {activeTab === "assessment" && !loading && !error && assessmentReports.length > 0 &&
          assessmentReports.map((report) => (
            <ReportCard
              key={report.id}
              reportId={report.id}
              title={report.title}
              meta={formatReportMeta(report.createdAt)}
              status="Published"
              onSelect={handleSelectReport}
              onDownload={handleDownload}
            />
          ))}
        {activeTab === "assessment" && !loading && !error && assessmentReports.length === 0 && (
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
