import {
  ClipboardCheck,
  FileText,
  Presentation,
  Route,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface ReportTypeOption {
  label: string;
  Icon: LucideIcon;
  /** Used for popup option styling (border/text color). */
  accent: "sales" | "exec" | "risk" | "roadmap";
}

/** Icons and accent colors for report type content. */
export const REPORT_TYPES: ReportTypeOption[] = [
  { label: "Sales Qualification Report", Icon: ClipboardCheck, accent: "sales" },
  { label: "Executive Stakeholder Brief", Icon: Presentation, accent: "exec" },
  { label: "Customer Risk Mitigation Plan", Icon: ShieldCheck, accent: "risk" },
  { label: "Implementation Roadmap Proposal", Icon: Route, accent: "roadmap" },
];

const ICON_BY_LABEL = new Map<string, LucideIcon>(
  REPORT_TYPES.map((t) => [t.label, t.Icon])
);

const ACCENT_BY_LABEL = new Map<string, ReportTypeOption["accent"]>(
  REPORT_TYPES.map((t) => [t.label, t.accent])
);

export function getReportTypeIcon(reportType: string): LucideIcon {
  return ICON_BY_LABEL.get(reportType.trim()) ?? FileText;
}

export function getReportTypeAccent(reportType: string): ReportTypeOption["accent"] | undefined {
  return ACCENT_BY_LABEL.get(reportType.trim());
}
