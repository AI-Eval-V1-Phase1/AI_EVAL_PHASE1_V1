import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react"
import "../UserManagement/user_management.css"
import "./reports.css"

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1"

/** Labels for report fields (camelCase keys from backend). */
const REPORT_FIELD_LABELS: Record<string, string> = {
  customerOrganizationName: "Customer organization",
  customerSector: "Industry sector",
  primaryPainPoint: "Primary pain point",
  expectedOutcomes: "Expected outcomes",
  customerBudgetRange: "Budget range",
  implementationTimeline: "Implementation timeline",
  productFeatures: "Product features",
  implementationApproach: "Implementation approach",
  customizationLevel: "Customization level",
  integrationComplexity: "Integration complexity",
  regulatoryRequirements: "Regulatory requirements",
  regulatoryRequirementsOther: "Regulatory requirements (other)",
  dataSensitivity: "Data sensitivity",
  customerRiskTolerance: "Customer risk tolerance",
  alternativesConsidered: "Alternatives considered",
  keyAdvantages: "Key advantages",
  customerSpecificRisks: "Customer-specific risks",
  customerSpecificRisksOther: "Customer-specific risks (other)",
  identifiedRisks: "Identified risks",
  riskDomainScores: "Risk domain scores",
  contextualMultipliers: "Contextual multipliers",
  riskMitigation: "Risk mitigation",
}

/** Risk categories for the detailed sections (reference UI). */
const RISK_CATEGORIES = [
  { id: "financial", label: "Financial risk", level: "Medium", levelClass: "risk_medium" },
  { id: "operational", label: "Operational risk", level: "Low", levelClass: "risk_low" },
  { id: "reputational", label: "Reputational risk", level: "Low", levelClass: "risk_low" },
  { id: "infosec", label: "Information security risk", level: "Medium", levelClass: "risk_medium" },
  { id: "compliance", label: "Compliance risk", level: "Low", levelClass: "risk_low" },
  { id: "esg", label: "ESG risk", level: "Low", levelClass: "risk_low" },
]

function formatReportSubtitle(createdAt: string): string {
  if (!createdAt) return "Customer Risk Assessment"
  try {
    const d = new Date(createdAt)
    if (Number.isNaN(d.getTime())) return "Customer Risk Assessment"
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "/")
  } catch {
    return "Customer Risk Assessment"
  }
}

function formatReportValue(val: unknown): string {
  if (val == null || val === "") return "—"
  if (Array.isArray(val)) return val.join(", ")
  if (typeof val === "object") return JSON.stringify(val)
  return String(val)
}

function ReportDetail() {
  const { reportId } = useParams<{ reportId: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<{
    id: string
    assessmentId?: string
    title: string
    report: Record<string, unknown>
    createdAt: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null)

  useEffect(() => {
    if (!reportId?.trim()) {
      setNotFound(true)
      setLoading(false)
      return
    }
    const token = sessionStorage.getItem("bearerToken")
    if (!token) {
      setLoading(false)
      setNotFound(true)
      return
    }
    setLoading(true)
    setNotFound(false)
    fetch(`${BASE_URL}/customerRiskReports/${encodeURIComponent(reportId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.success && data?.data) {
          setReport({
            id: data.data.id,
            assessmentId: data.data.assessmentId,
            title: data.data.title,
            report: data.data.report ?? {},
            createdAt: data.data.createdAt ?? "",
          })
          setNotFound(false)
        } else {
          setNotFound(true)
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [reportId])

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate("/reports")
  }

  if (loading) {
    return (
      <div className="sec_user_page org_settings_page reports_page report_detail_page">
        <div className="report_detail_empty">
          <p className="report_detail_empty_text">Loading report…</p>
        </div>
      </div>
    )
  }

  if (notFound || !report) {
    return (
      <div className="sec_user_page org_settings_page reports_page report_detail_page">
        <div className="report_detail_empty">
          <h2 className="report_detail_empty_title">Report not found</h2>
          <p className="report_detail_empty_text">
            This report does not exist or has been removed. Please check the report ID or return to the library.
          </p>
          <a href="/reports" className="report_detail_back_link report_detail_empty_back" onClick={handleBack}>
            <ArrowLeft size={18} />
            Back to Reports Library
          </a>
        </div>
      </div>
    )
  }

  const data = report.report as Record<string, unknown>
  const assessmentId = (data.assessmentId ?? report.assessmentId ?? report.id) as string
  const assessmentDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "/")
    : "—"

  const displayKeys = Object.keys(REPORT_FIELD_LABELS).filter(
    (k) => data[k] != null && data[k] !== "" && (Array.isArray(data[k]) ? (data[k] as unknown[]).length > 0 : true),
  )

  return (
    <div className="sec_user_page org_settings_page reports_page report_detail_page report_detail_full">
      {/* Header */}
      <div className="report_detail_header">
        <div className="report_detail_back_title">
          <a href="/reports" className="report_detail_back_link" onClick={handleBack}>
            <ArrowLeft size={18} />
            Back to Reports
          </a>
          <nav className="report_detail_breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="report_detail_breadcrumb_sep"> &gt; </span>
            <a href="/reports">Reports</a>
            <span className="report_detail_breadcrumb_sep"> &gt; </span>
            <span aria-current="page">{report.title}</span>
          </nav>
          <h1 className="report_detail_title">Customer Risk Assessment Report</h1>
          <p className="report_detail_subtitle">{report.title} • {formatReportSubtitle(report.createdAt)}</p>
        </div>
      </div>

      {/* 1. Assessment Information */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Assessment information</h2>
        <dl className="report_detail_dl report_detail_info_grid">
          <div className="report_detail_row">
            <dt className="report_detail_dt">Assessment ID</dt>
            <dd className="report_detail_dd">{assessmentId ?? "—"}</dd>
          </div>
          <div className="report_detail_row">
            <dt className="report_detail_dt">Assessment name</dt>
            <dd className="report_detail_dd">{report.title}</dd>
          </div>
          <div className="report_detail_row">
            <dt className="report_detail_dt">Assessment date</dt>
            <dd className="report_detail_dd">{assessmentDate}</dd>
          </div>
          <div className="report_detail_row">
            <dt className="report_detail_dt">Assessment status</dt>
            <dd className="report_detail_dd"><span className="report_status_badge report_status_completed">Completed</span></dd>
          </div>
          <div className="report_detail_row">
            <dt className="report_detail_dt">Assessment version</dt>
            <dd className="report_detail_dd">1.0</dd>
          </div>
        </dl>
      </section>

      {/* 2. Overall summary */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Overall summary</h2>
        <p className="report_summary_body">
          {data.riskMitigation
            ? formatReportValue(data.riskMitigation)
            : "This Customer Risk Assessment was generated when the vendor COTS assessment was completed. Review the assessment details and risk sections below."}
        </p>
      </section>

      {/* 3. Assessment result summary */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Assessment result summary</h2>
        <div className="report_table_wrap">
          <table className="report_table" aria-label="Risk levels">
            <thead>
              <tr>
                <th>Assessment item</th>
                <th>Risk level</th>
                <th>Response status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Overall</td>
                <td><span className="report_risk_badge risk_low">Low</span></td>
                <td>Completed</td>
              </tr>
              {RISK_CATEGORIES.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.label}</td>
                  <td><span className={`report_risk_badge ${cat.levelClass}`}>{cat.level}</span></td>
                  <td>Completed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="report_table_wrap" style={{ marginTop: "1rem" }}>
          <table className="report_table" aria-label="Scores">
            <thead>
              <tr>
                <th>Item</th>
                <th>Score</th>
                <th>Max</th>
                <th>Rate</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Overall</td>
                <td>—</td>
                <td>—</td>
                <td>{data.riskDomainScores ? formatReportValue(data.riskDomainScores) : "—"}</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Detailed risk category sections */}
      {RISK_CATEGORIES.map((cat) => (
        <section key={cat.id} className="report_section_card report_risk_section">
          <h2 className="report_section_heading">
            {cat.label}
            <span className={`report_risk_badge ${cat.levelClass}`}>{cat.level}</span>
          </h2>
          <p className="report_risk_intro">
            This section summarises {cat.label.toLowerCase()} considerations from the assessment.
          </p>
          <ul className="report_risk_list">
            <li><span className="report_risk_item_text">Assessment completed</span><CheckCircle2 size={16} className="report_risk_icon_ok" aria-hidden /></li>
            <li><span className="report_risk_item_text">Findings documented</span><CheckCircle2 size={16} className="report_risk_icon_ok" aria-hidden /></li>
            <li><span className="report_risk_item_text">Follow-up where applicable</span><AlertTriangle size={16} className="report_risk_icon_warn" aria-hidden /></li>
          </ul>
          <button
            type="button"
            className="report_show_details_btn"
            onClick={() => setExpandedRisk(expandedRisk === cat.id ? null : cat.id)}
            aria-expanded={expandedRisk === cat.id}
          >
            {expandedRisk === cat.id ? "Hide details" : "Show details"}
            <ChevronDown size={16} className={expandedRisk === cat.id ? "report_chevron_open" : ""} />
          </button>
          {expandedRisk === cat.id && (
            <div className="report_risk_expanded">
              <p>Additional detail for {cat.label} can be included here when available.</p>
            </div>
          )}
        </section>
      ))}

      {/* 5. Recommended actions */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Recommended actions</h2>
        <div className="report_table_wrap">
          <table className="report_table" aria-label="Recommended actions">
            <thead>
              <tr>
                <th>Recommendation</th>
                <th>Content</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.riskMitigation ? (
                <tr>
                  <td>Risk mitigation</td>
                  <td>{formatReportValue(data.riskMitigation)}</td>
                  <td>Noted</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={3} className="report_table_empty">No recommended actions recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Assessment history */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Assessment history</h2>
        <div className="report_table_wrap">
          <table className="report_table" aria-label="Assessment history">
            <thead>
              <tr>
                <th>Assessment date</th>
                <th>Assessment ID</th>
                <th>Assessment name</th>
                <th>Risk level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{assessmentDate}</td>
                <td>{assessmentId ?? "—"}</td>
                <td>{report.title}</td>
                <td><span className="report_risk_badge risk_low">Low</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Attachments */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Attachments</h2>
        <p className="report_attachment_empty">No attachments for this report.</p>
      </section>

      {/* 8. Comments */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Comments</h2>
        <p className="report_summary_body report_comments_placeholder">
          Additional comments or supplementary information regarding this assessment can be added here when available.
        </p>
      </section>

      {/* 9. Customer basic information */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Customer basic information</h2>
        <dl className="report_detail_dl">
          {displayKeys.filter((k) =>
            ["customerOrganizationName", "customerSector", "customerBudgetRange", "implementationTimeline"].includes(k),
          ).map((key) => (
            <div key={key} className="report_detail_row">
              <dt className="report_detail_dt">{REPORT_FIELD_LABELS[key]}</dt>
              <dd className="report_detail_dd">{formatReportValue(data[key])}</dd>
            </div>
          ))}
          {displayKeys.filter((k) =>
            ["customerOrganizationName", "customerSector", "customerBudgetRange", "implementationTimeline"].includes(k),
          ).length === 0 && (
            <div className="report_detail_row">
              <dd className="report_detail_dd" style={{ gridColumn: "1 / -1" }}>No customer basic information recorded.</dd>
            </div>
          )}
        </dl>
      </section>

      {/* 10. Business overview */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Business overview</h2>
        <dl className="report_detail_dl">
          {displayKeys.filter((k) =>
            ["primaryPainPoint", "expectedOutcomes", "keyAdvantages", "alternativesConsidered"].includes(k),
          ).map((key) => (
            <div key={key} className="report_detail_row">
              <dt className="report_detail_dt">{REPORT_FIELD_LABELS[key]}</dt>
              <dd className="report_detail_dd">{formatReportValue(data[key])}</dd>
            </div>
          ))}
          {displayKeys.filter((k) =>
            ["primaryPainPoint", "expectedOutcomes", "keyAdvantages", "alternativesConsidered"].includes(k),
          ).length === 0 && (
            <div className="report_detail_row">
              <dd className="report_detail_dd" style={{ gridColumn: "1 / -1" }}>No business overview recorded.</dd>
            </div>
          )}
        </dl>
      </section>

      {/* 11. Main products / solution fit */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Main products & solution fit</h2>
        <dl className="report_detail_dl">
          {displayKeys.filter((k) =>
            ["productFeatures", "implementationApproach", "customizationLevel", "integrationComplexity"].includes(k),
          ).map((key) => (
            <div key={key} className="report_detail_row">
              <dt className="report_detail_dt">{REPORT_FIELD_LABELS[key]}</dt>
              <dd className="report_detail_dd">{formatReportValue(data[key])}</dd>
            </div>
          ))}
          {displayKeys.filter((k) =>
            ["productFeatures", "implementationApproach", "customizationLevel", "integrationComplexity"].includes(k),
          ).length === 0 && (
            <div className="report_detail_row">
              <dd className="report_detail_dd" style={{ gridColumn: "1 / -1" }}>No product or solution fit details recorded.</dd>
            </div>
          )}
        </dl>
      </section>

      {/* 12. Regulatory & risk */}
      <section className="report_section_card">
        <h2 className="report_section_heading">Regulatory requirements & risk</h2>
        <dl className="report_detail_dl">
          {displayKeys.filter((k) =>
            ["regulatoryRequirements", "regulatoryRequirementsOther", "dataSensitivity", "customerRiskTolerance", "customerSpecificRisks", "customerSpecificRisksOther", "identifiedRisks", "riskDomainScores", "contextualMultipliers", "riskMitigation"].includes(k),
          ).map((key) => (
            <div key={key} className="report_detail_row">
              <dt className="report_detail_dt">{REPORT_FIELD_LABELS[key]}</dt>
              <dd className="report_detail_dd">{formatReportValue(data[key])}</dd>
            </div>
          ))}
          {displayKeys.filter((k) =>
            ["regulatoryRequirements", "regulatoryRequirementsOther", "dataSensitivity", "customerRiskTolerance", "customerSpecificRisks", "customerSpecificRisksOther", "identifiedRisks", "riskDomainScores", "contextualMultipliers", "riskMitigation"].includes(k),
          ).length === 0 && (
            <div className="report_detail_row">
              <dd className="report_detail_dd" style={{ gridColumn: "1 / -1" }}>No regulatory or risk details recorded.</dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  )
}

export default ReportDetail
