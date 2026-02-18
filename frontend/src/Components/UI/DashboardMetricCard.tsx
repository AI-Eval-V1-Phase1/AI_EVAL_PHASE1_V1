import type { ReactNode } from "react"

export interface DashboardMetricCardProps {
  /** Card title (e.g. "Profile Completeness") */
  title: string
  /** Icon in top-right (e.g. ClipboardCheck, Info, CheckCircle2) */
  icon?: ReactNode
  /** Main value (e.g. "100%", "2", "A+") */
  value: string | number
  /** Sub-text below value */
  description: string
  /** Optional progress 0–100; when set, shows a progress bar below value */
  progress?: number
  /** "grade" = green value (e.g. Trust Score A+) */
  valueVariant?: "default" | "grade"
  className?: string
}

function DashboardMetricCard({
  title,
  icon,
  value,
  description,
  progress,
  valueVariant = "default",
  className = "",
}: DashboardMetricCardProps) {
  return (
    <div
      className={`vendor_overview_metric_card ${className}`.trim()}
      data-value-variant={valueVariant}
    >
      {icon != null && (
        <span className="vendor_overview_metric_card_icon" aria-hidden>
          {icon}
        </span>
      )}
      <p className="vendor_overview_metric_title">{title}</p>
      <p
        className={`vendor_overview_metric_value ${valueVariant === "grade" ? "vendor_overview_metric_value_grade" : ""}`.trim()}
      >
        {value}
      </p>
      {progress != null && (
        <div className="vendor_overview_progress_bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="vendor_overview_progress_fill"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
      <p className="vendor_overview_metric_desc">{description}</p>
    </div>
  )
}

export default DashboardMetricCard
