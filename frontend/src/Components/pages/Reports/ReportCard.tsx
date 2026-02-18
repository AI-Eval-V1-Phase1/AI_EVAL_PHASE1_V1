import type { ReactNode } from "react"
import { FileText, Download } from "lucide-react"

export interface ReportCardProps {
  /** Report id for navigation */
  reportId: string
  /** Main title (e.g. "AI Vendor Assessment: MedicarAI for Mount Sinai...") */
  title: string
  /** Metadata line (e.g. "Vendor Assessment Report • 22/1/2026") */
  meta: string
  /** Status label (e.g. "Published") */
  status?: string
  /** Icon (default: FileText in purple container) */
  icon?: ReactNode
  /** Callback when card is clicked (e.g. navigate). If not provided, uses default link behavior. */
  onSelect?: (reportId: string) => void
  /** Callback when download is clicked; prevents navigation if provided */
  onDownload?: (reportId: string, e: React.MouseEvent) => void
}

function ReportCard({
  reportId,
  title,
  meta,
  status = "Published",
  icon,
  onSelect,
  onDownload,
}: ReportCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".report_card_download")) {
      e.preventDefault()
      onDownload?.(reportId, e)
      return
    }
    if (onSelect) {
      e.preventDefault()
      onSelect(reportId)
    }
  }

  const content = (
    <>
      <span className="report_card_icon" aria-hidden>
        {icon ?? <FileText size={22} />}
      </span>
      <div className="report_card_content">
        <p className="report_card_title">{title}</p>
        <p className="report_card_meta">{meta}</p>
      </div>
      <div className="report_card_actions">
        {status && (
          <span className="report_card_status">{status}</span>
        )}
        <button
          type="button"
          className="report_card_download"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDownload?.(reportId, e)
          }}
          aria-label="Download report"
        >
          <Download size={20} />
        </button>
      </div>
    </>
  )

  if (onSelect) {
    return (
      <div
        role="button"
        tabIndex={0}
        className="report_card"
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSelect(reportId)
          }
        }}
      >
        {content}
      </div>
    )
  }

  return (
    <a href={`/reports/${reportId}`} className="report_card">
      {content}
    </a>
  )
}

export default ReportCard
