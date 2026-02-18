import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react"
import "../UserManagement/user_management.css"
import "./reports.css"

/** Mock report detail – replace with API when available */
const MOCK_REPORT_DETAIL: Record<
  string,
  {
    title: string
    subtitle: string
    recommendation: string
    riskScore?: string
    executiveSummary: string
    completed?: boolean
  }
> = {
  "1": {
    completed: true,
    title: "MedicarAI for Mount Sinai Health System – Vendor Risk Assessment Report",
    subtitle: "Vendor Assessment • 22/1/2026 • AI Generated",
    recommendation:
      "Approved with Conditions - MedicarAI presents a strong technical and strategic fit for healthcare AI deployment. Due diligence is recommended on data handling and regulatory alignment.",
    riskScore: "78",
    executiveSummary:
      "MedicarAI is an AI-driven clinical decision support platform. This assessment evaluates technical robustness, compliance posture, and integration readiness for Mount Sinai Health System.\n\nKey strengths include demonstrated accuracy in pilot studies and a clear roadmap for FDA alignment. Areas for continued evaluation include ongoing monitoring of model performance and vendor exit strategy.",
  },
  "2": {
    completed: true,
    title: "MedicarAI – Vendor Risk Assessment Report",
    subtitle: "Vendor Assessment Report • 27/1/2026 • AI Generated",
    recommendation:
      "Approved - MedicarAI meets the required trust and compliance criteria for inclusion in the vendor program. Continuous monitoring is recommended.",
    riskScore: "82",
    executiveSummary:
      "Summary of the vendor risk assessment for MedicarAI, covering technical, compliance, and operational dimensions.",
  },
  "3": {
    completed: true,
    title: "AcmeAnalytics – Vendor Risk Assessment Report",
    subtitle: "Vendor Assessment • 21/11/2025 • AI Generated",
    recommendation:
      "Approved with Conditions - AcmeAnalytics presents a strong technical and strategic fit for Meridian's predictive analytics needs. However, due diligence is required to address integration complexity, regulatory compliance, and to negotiate favorable contract terms. Continuous vendor management and risk monitoring are recommended to ensure long-term success.",
    riskScore: "",
    executiveSummary:
      "AcmeAnalytics is an AI-driven predictive analytics platform tailored for financial services. The platform demonstrates technical robustness and scalability.\n\nThorough evaluation is recommended to mitigate potential risks in integration complexity and regulatory compliance. Contract negotiations should focus on data ownership and exit strategy.\n\nThe vendor shows positive reputation and financial stability; continuous monitoring is advised. AcmeAnalytics is a promising partner, contingent upon addressing identified risks and aligning contract terms with Meridian's policies.",
  },
  "4": {
    completed: true,
    title: "DataForge AI – Vendor Risk Assessment Report",
    subtitle: "Vendor Assessment Report • 27/1/2026 • AI Generated",
    recommendation:
      "Approved with Conditions - DataForge AI meets core technical requirements. Address data residency and SLA terms before final approval.",
    riskScore: "75",
    executiveSummary:
      "DataForge AI provides enterprise data pipeline and analytics capabilities. This report summarizes the risk assessment and recommends next steps for procurement and vendor management.",
  },
}

function ReportDetail() {
  const { reportId } = useParams<{ reportId: string }>()
  const navigate = useNavigate()

  const report = reportId && MOCK_REPORT_DETAIL[reportId] ? MOCK_REPORT_DETAIL[reportId] : null
  const notFound = !reportId || !report
  const notCompleted = report && report.completed === false

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate("/reports")
  }

  const handleExportPdf = () => {
    // TODO: trigger PDF export
  }

  if (notFound) {
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

  if (notCompleted) {
    return (
      <div className="sec_user_page org_settings_page reports_page report_detail_page">
        <div className="report_detail_empty">
          <h2 className="report_detail_empty_title">Report not completed</h2>
          <p className="report_detail_empty_text">
            This report is still being generated or the assessment has not been completed yet. Please try again later or return to the library.
          </p>
          <a href="/reports" className="report_detail_back_link report_detail_empty_back" onClick={handleBack}>
            <ArrowLeft size={18} />
            Back to Reports Library
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="sec_user_page org_settings_page reports_page report_detail_page">
      <div className="report_detail_header">
        <div className="report_detail_back_title">
          <a href="/reports" className="report_detail_back_link" onClick={handleBack}>
            <ArrowLeft size={18} />
            Back to Reports
          </a>
          <h1 className="report_detail_title">{report.title}</h1>
          <p className="report_detail_subtitle">{report.subtitle}</p>
        </div>
        <button
          type="button"
          className="report_detail_export_btn"
          onClick={handleExportPdf}
        >
          <Download size={18} />
          Export PDF
        </button>
      </div>

      <div className="report_recommendation_card">
        <h2 className="report_recommendation_heading">
          <CheckCircle2 size={20} className="report_recommendation_heading_icon" />
          Assessment Recommendation
        </h2>
        <p className="report_recommendation_text">{report.recommendation}</p>
        <p className="report_recommendation_score">
          Overall Risk Score: {report.riskScore != null && report.riskScore !== "" ? `${report.riskScore}/100` : "/100"}
        </p>
      </div>

      <div className="report_summary_card">
        <h2 className="report_summary_heading">Executive Summary</h2>
        <p className="report_summary_body">{report.executiveSummary}</p>
      </div>
    </div>
  )
}

export default ReportDetail
