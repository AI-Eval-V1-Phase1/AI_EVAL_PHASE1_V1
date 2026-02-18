import type { AssessmentRow } from "./types";

/** Format date for display; returns "—" if invalid or missing */
export const formatDisplayDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleDateString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return "—";
  }
};

export const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

export const formatGovDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleDateString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return "—";
  }
};

export const formatUpdatedDate = (dateStr: string | null | undefined): string => {
  const formatted = formatGovDate(dateStr);
  return formatted === "—" ? "—" : `Updated: ${formatted}`;
};

export const formatCompletedDate = (dateStr: string | null | undefined): string => {
  const formatted = formatGovDate(dateStr);
  return formatted === "—" ? "—" : `Completed: ${formatted}`;
};

export const getAssessmentLabel = (a: AssessmentRow): string => {
  const product = (a.productName ?? "").toString().trim();
  const vendor = (a.vendorName ?? "").toString().trim();
  if (product && vendor) return `${product} - ${vendor}`;
  if (product) return product;
  if (vendor) return vendor;
  return `Assessment #${a.assessmentId}`;
};

export const getCompletedByDisplay = (a: AssessmentRow): string => {
  const first = (a.completedByUserFirstName ?? "").toString().trim();
  const last = (a.completedByUserLastName ?? "").toString().trim();
  const fullName = [first, last].filter(Boolean).join(" ");
  if (fullName) return fullName;
  const userName = (a.completedByUserName ?? "").toString().trim();
  if (userName) return userName;
  const email = (a.completedByUserEmail ?? "").toString().trim();
  if (email) return email;
  return "";
};
