import { ChevronRight, Download, FileText } from "lucide-react";
import React from "react";
import ClickTooltip from "../../UI/ClickTooltip";
import type { GeneratedReportItem } from "./GeneralReports";
import { getReportTypeAccent, getReportTypeIcon } from "./reportTypes";
import "../VendorDirectory/VendorDirectory.css";

interface GeneralReportsCardsProps {
  reports: GeneratedReportItem[];
  onViewReport: (report: GeneratedReportItem) => void;
  onDownload?: (report: GeneratedReportItem) => void;
}

function formatReportDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/\s+/g, "-");
  } catch {
    return "—";
  }
}

/** Expiry: 1 year from generated date (no expiry field in data). */
function getExpiryDate(generatedAt: string): string {
  try {
    const d = new Date(generatedAt);
    if (Number.isNaN(d.getTime())) return "—";
    d.setFullYear(d.getFullYear() + 1);
    return d
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/\s+/g, "-");
  } catch {
    return "—";
  }
}

function GeneralReportsCards({
  reports,
  onViewReport,
  onDownload,
}: GeneralReportsCardsProps) {
  return (
    <div className="general_rpr_cards_sec vendor_directory_grid">
      {reports.map((report) => (
        <article
          key={report.id}
          className="vendor_directory_card general_rpr_card"
          data-accent={getReportTypeAccent(report.reportType) ?? undefined}
        >
          <div className="general_report_card_header">
            <p className="vendor_directory_card_products general_rpr_card_report_type">

              <span className="general_rpr_card_report_type_icon" aria-hidden>
                {(() => {
                  const TypeIcon = getReportTypeIcon(report.reportType);
                  return <TypeIcon size={16} />;
                })()}
              </span>
              {report.reportType}
            </p>
            
            <span className="general_rpr_card_download_wrap">
              <button
                type="button"
                className="general_rpr_card_download_btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(report);
                }}
                aria-label={`Download ${report.reportType}`}
              >
                <Download size={14} aria-hidden />
              </button>
            </span>
          </div>
          <div className="general_rpr_title">
            {/* <div className="report_card_icon general_rpr_card_type_icon">
              <FileText size={20} aria-hidden />
            </div> */}
            <div className="vendor_directory_card_header_text">
              <ClickTooltip
                content={report.assessmentLabel}
                position="top"
                showOn="hover"
              >
                <span className="general_rpr_card_title_wrap">
                  <h2 className="vendor_directory_card_name general_rpr_card_title_clamp">
                    {report.assessmentLabel}
                  </h2>
                </span>
              </ClickTooltip>
            </div>

          </div>
          <div className="general_rpr_card_footer">
            <div className="general_rpr_card_dates">
              {/* <div className="general_rpr_card_date_row">
                <span className="general_rpr_card_date_label">Generated:</span>
                <span className="general_rpr_card_date_value">
                  {formatReportDate(report.generatedAt)}
                </span>
              </div> */}
              <div className="general_rpr_card_date_row">
                <span className="general_rpr_card_date_label_expiry">
                  Expires on:
                </span>
                <span className="general_rpr_card_date_value_expiry">
                  {getExpiryDate(report.generatedAt)}
                </span>
              </div>
            </div>
            <button
              type="button"
              className=" view_rpr_btn vendor_directory_card_action_btn"
              onClick={() => onViewReport(report)}
              aria-label={`View report: ${report.reportType}`}
            >
              View Report
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default GeneralReportsCards;
