/**
 * Product Profile view for vendors: summary cards (Trust Score, No of products, Company, Regions),
 * product cards with trust score and View details, and View Product modal with attestation details.
 */
import { useState } from "react";
import {
  Shield,
  FileCheck,
  Building2,
  Globe,
  FileText,
  Package,
  CircleX,
  ChevronRight,
} from "lucide-react";
import type { VendorSelfAttestationFormState } from "../../../types/vendorSelfAttestation";
import type { GeneratedProductProfileReport } from "../../../types/generatedProductProfile";
import ProductProfileSummaryCard from "./ProductProfileSummaryCard";
import GeneratedProductProfileCards from "./GeneratedProductProfileCards";
import type {
  ProductProfileProduct,
  StoredGeneratedReport,
} from "../DirectoryListing/DirectoryListing";
import "../UserManagement/user_management.css";
import "./product_profile.css";

function formatVal(val: unknown): string {
  if (val == null || val === "") return "Not specified.";
  if (Array.isArray(val)) return val.length ? val.join(", ") : "Not specified.";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function truncate(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen).trim() + "...";
}

function productInitials(name: string): string {
  const s = (name || "Draft").trim();
  if (s.length >= 2) return s.slice(0, 2).toUpperCase();
  return s ? s.toUpperCase() : "Dr";
}

/** Parse trust score 0–100 from text (e.g. "62 (Moderate)" or "Overall Trust Score: 62"). */
function parseScoreFromText(text: string): number | null {
  if (!text || typeof text !== "string") return null;
  const withParen = text.match(/(\d{1,3})\s*[(\[]/);
  const m = withParen ?? text.match(/\b(\d{1,3})\b/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isNaN(n) ? null : Math.min(100, Math.max(0, n));
}

/** Get overallScore (0–100) from report column trustScore.overallScore when full report validation fails. */
function getOverallScoreFromReport(raw: unknown): number | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const ts = o.trustScore;
  if (ts == null || typeof ts !== "object") return null;
  const t = ts as Record<string, unknown>;
  if (typeof t.overallScore === "number") return Math.min(100, Math.max(0, t.overallScore));
  return null;
}

/** Normalize API-generated report to GeneratedProductProfileReport (from attestation submit or fetch). */
function asGeneratedReport(raw: unknown): GeneratedProductProfileReport | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    o.trustScore == null ||
    typeof o.trustScore !== "object" ||
    !Array.isArray(o.sections)
  )
    return null;
  const ts = o.trustScore as Record<string, unknown>;
  const summary = typeof ts.summary === "string" ? ts.summary : "";
  let overallScore = typeof ts.overallScore === "number" ? ts.overallScore : 0;
  if (overallScore === 0) {
    const fromSummary = summary ? parseScoreFromText(summary) : null;
    const fromLabel = typeof ts.label === "string" ? parseScoreFromText(ts.label) : null;
    const parsed = fromSummary ?? fromLabel ?? null;
    if (parsed != null) overallScore = parsed;
  }
  return {
    trustScore: {
      overallScore,
      label: (typeof ts.label === "string" ? ts.label : "") || "—",
      summary,
      scoreByCategory: ts.scoreByCategory as
        | Record<string, string | number>
        | undefined,
    },
    sections: o.sections as GeneratedProductProfileReport["sections"],
  };
}

export interface ProductProfileViewProps {
  formState: VendorSelfAttestationFormState | null;
  /** List of products (attestations) for product cards */
  products?: ProductProfileProduct[];
  /** Fetch full attestation detail by id for View Product modal */
  fetchProductDetail?: (
    id: string,
  ) => Promise<VendorSelfAttestationFormState | null>;
  /** Trust score label e.g. "A+", compliancePercent e.g. "92%" */
  trustScore?: string;
  compliancePercent?: string;
  /** Public directory listing (moved from dashboard) */
  publicListing?: boolean;
  onPublicListingToggle?: () => void;
  publicListingUpdating?: boolean;
  publicListingError?: string | null;
  /** Toggle product visibility to buyers (only for Completed products) */
  onProductVisibilityToggle?: (productId: string, visible: boolean) => void;
  /** Toggle a detail section's visibility to buyers (only for Completed products) */
  onSectionVisibilityChange?: (
    attestationId: string,
    sectionKey: SectionVisibilityKey,
    value: boolean,
  ) => Promise<void>;
  /** Generated product profile (from agent or selected stored report); trust score shown on top in cards */
  generatedReport?: GeneratedProductProfileReport | null;
  /** Stored generated reports from GET generated-reports */
  storedReports?: StoredGeneratedReport[];
  selectedStoredReportId?: string | null;
  onSelectStoredReport?: (
    report: GeneratedProductProfileReport,
    storedReportId: string,
  ) => void;
  generateLoading?: boolean;
  generateError?: string | null;
  vendorDataInput?: string;
  onVendorDataInputChange?: (value: string) => void;
  onUseAttestationData?: () => void;
  onGenerateProfile?: () => void;
}

export type SectionVisibilityKey =
  | "visible_ai_governance"
  | "visible_security_posture"
  | "visible_data_privacy"
  | "visible_compliance"
  | "visible_model_risk"
  | "visible_data_practices"
  | "visible_compliance_certifications"
  | "visible_operations_support"
  | "visible_vendor_management";

function ProductProfileView({
  formState,
  products = [],
  fetchProductDetail,
  trustScore = "A+",
  compliancePercent = "92%",
  publicListing = false,
  onPublicListingToggle,
  publicListingUpdating = false,
  publicListingError = null,
  onProductVisibilityToggle,
  onSectionVisibilityChange,
  generatedReport = null,
  storedReports = [],
  selectedStoredReportId = null,
  onSelectStoredReport,
  generateLoading = false,
  generateError = null,
  vendorDataInput = "",
  onVendorDataInputChange,
  onUseAttestationData,
  onGenerateProfile,
}: ProductProfileViewProps) {
  const [viewProductModalOpen, setViewProductModalOpen] = useState(false);
  const [viewProductDetail, setViewProductDetail] =
    useState<VendorSelfAttestationFormState | null>(null);
  const [viewProductMeta, setViewProductMeta] = useState<{
    productName: string;
    status: string;
    completedDate: string;
    productId: string;
    visibleToBuyer: boolean;
  } | null>(null);
  const [viewProductLoading, setViewProductLoading] = useState(false);

  /** Report to show on main page: from manual generate, selected stored report, or first product that has a report. */
  const reportToShow =
    generatedReport ??
    asGeneratedReport(
      products.find((p) => p.generated_profile_report)
        ?.generated_profile_report,
    );

  const company = formState?.companyProfile;
  const attestation = formState?.attestation ?? {};

  const companyName = company?.companyDescription
    ? truncate(formatVal(company.companyDescription), 40)
    : "Not specified.";
  const vendorType = formatVal(company?.vendorType) || "SaaS Provider";
  const operatingRegions =
    Array.isArray(company?.operatingRegions) &&
    company.operatingRegions.length > 0
      ? company.operatingRegions.join(", ")
      : "Not specified.";
  const headquarters = formatVal(company?.headquartersLocation);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr || String(dateStr).trim() === "") return "—";
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

  const handleViewProduct = async (product: ProductProfileProduct) => {
    if (!fetchProductDetail) return;
    setViewProductModalOpen(true);
    setViewProductDetail(null);
    setViewProductMeta({
      productName: product.productName,
      status: product.status,
      completedDate: formatDate(product.updated_at),
      productId: product.id,
      visibleToBuyer: product.visibleToBuyer ?? false,
    });
    setViewProductLoading(true);
    try {
      const detail = await fetchProductDetail(product.id);
      setViewProductDetail(detail);
    } finally {
      setViewProductLoading(false);
    }
  };

  const attRecord = viewProductDetail?.attestation as
    | Record<string, unknown>
    | undefined;
  /** Section id (1–9) maps to backend visibility keys. */
  const SECTION_VISIBILITY_KEYS: Record<number, SectionVisibilityKey> = {
    1: "visible_ai_governance",
    2: "visible_security_posture",
    3: "visible_data_privacy",
    4: "visible_compliance",
    5: "visible_model_risk",
    6: "visible_data_practices",
    7: "visible_compliance_certifications",
    8: "visible_operations_support",
    9: "visible_vendor_management",
  };
  const sectionVisible = (key: SectionVisibilityKey) =>
    attRecord?.[key] === true;
  const handleSectionToggle = async (
    key: SectionVisibilityKey,
    next: boolean,
  ) => {
    if (!viewProductMeta || !onSectionVisibilityChange) return;
    await onSectionVisibilityChange(viewProductMeta.productId, key, next);
    if (fetchProductDetail) {
      const detail = await fetchProductDetail(viewProductMeta.productId);
      setViewProductDetail(detail);
    }
  };
  const getSectionVisibility = (sectionId: number) => {
    const key = SECTION_VISIBILITY_KEYS[sectionId];
    if (
      !key ||
      !viewProductMeta ||
      viewProductMeta.status !== "Completed" ||
      !onSectionVisibilityChange
    )
      return null;
    return {
      visible: sectionVisible(key),
      onToggle: (next: boolean) => handleSectionToggle(key, next),
    };
  };

  return (
    <div className="sec_user_page attestation_page org_settings_page product_profile_page">
      <div className="heading_user_page page_header_align">
        <div className="headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <FileText size={24} className="header_icon_svg" />
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Product Profile</h1>
            <p className="sub_title page_header_subtitle">
              Your AI product attestation data and compliance posture.
            </p>
          </div>
        </div>
        <div className="btn_user_page product_profile_header_actions">
          {onPublicListingToggle != null && (
            <>
              <div className="product_profile_toggle_wrap">
                <button
                  type="button"
                  className="product_profile_toggle"
                  aria-pressed={publicListing}
                  onClick={onPublicListingToggle}
                  disabled={publicListingUpdating}
                  aria-label="Public Directory Listing"
                />
                <span>Public Directory Listing</span>
              </div>
              {publicListingError != null && publicListingError !== "" && (
                <p className="product_profile_toggle_error" role="alert">
                  {publicListingError}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Generate profile: vendor data input + generate button; generated data in cards (no file) */}
      {/* {onGenerateProfile && (
        <section className="generated_profile_form" aria-label="Generate product profile">
          <h2 className="generated_profile_form_title">Generate product profile</h2>
          <p className="product_profile_detail_subtitle" style={{ marginBottom: "0.5rem" }}>
            Paste vendor data below or use your saved attestation data, then generate a structured report. Results appear in cards with trust score on top (no file download).
          </p>
          {onVendorDataInputChange && (
            <textarea
              className="generated_profile_form_textarea"
              placeholder="Paste vendor data here, or click “Use my attestation data” to fill from your profile…"
              value={vendorDataInput}
              onChange={(e) => onVendorDataInputChange(e.target.value)}
              aria-label="Vendor data for profile generation"
            />
          )}
          <div className="generated_profile_form_actions">
            {onUseAttestationData && (
              <button
                type="button"
                className="product_profile_btn_view_attestation"
                onClick={onUseAttestationData}
              >
                Use my attestation data
              </button>
            )}
            <button
              type="button"
              className="product_profile_btn_view_attestation"
              onClick={onGenerateProfile}
              disabled={generateLoading}
            >
              {generateLoading ? "Generating…" : "Generate profile"}
            </button>
          </div>
          {generateError && (
            <p className="generated_profile_form_error" role="alert">
              {generateError}
            </p>
          )}
        </section>
      )} */}

      <section className="product_profile_summary_cards">
        <ProductProfileSummaryCard
          title="Average Trust Score"
          icon={<Shield size={24} />}
          primary={
            reportToShow?.trustScore
              ? `${reportToShow.trustScore.overallScore}%`
              : trustScore
          }
          secondary={
            reportToShow?.trustScore?.summary
              ? truncate((reportToShow.trustScore.summary || "").replace(/\s*-+\s*$/, "").trim(), 60)
              : `${compliancePercent} compliance`
          }
          iconColor="blue"
          primaryVariant="trustScore"
        />
        <ProductProfileSummaryCard
          title="No of products"
          icon={<Package size={24} />}
          primary={String(products.length)}
          secondary={products.length === 1 ? "product" : "products"}
          iconColor="blue"
        />
        <ProductProfileSummaryCard
          title="Company"
          icon={<Building2 size={24} />}
          primary={companyName}
          secondary={vendorType}
          iconColor="blue"
        />
        <ProductProfileSummaryCard
          title="Operating Regions"
          icon={<Globe size={24} />}
          primary={operatingRegions}
          secondary={headquarters || "—"}
          iconColor="blue"
        />
      </section>

      {products.length > 0 && (
        <section className="product_profile_products_section">
          <h2 className="product_profile_products_heading">Products</h2>
          <div className="product_profile_product_cards">
            {products.map((product) => {
              const productReport = asGeneratedReport(product.generated_profile_report);
              const overallFromReport = getOverallScoreFromReport(product.generated_profile_report);
              const trustScoreDisplay =
                productReport?.trustScore != null
                  ? `${productReport.trustScore.overallScore}%`
                  : overallFromReport != null
                    ? `${overallFromReport}%`
                    : "—";
              return (
              <div key={product.id} className="product_profile_product_card">
                <div className="product_profile_product_card_top">
                  <div className="product_profile_product_card_content">
                    <div className="product_profile_product_card_title_row">
                      <span
                        className="product_profile_product_card_icon"
                        aria-hidden
                      >
                        {productInitials(product.productName)}
                      </span>
                      <div className="product_status_Data">
                        <h3 className="product_profile_product_card_title">
                          {product.productName}
                        </h3>
                        <span
                          className={`product_profile_product_card_status product_profile_product_card_status_${product.status.toLowerCase()}`}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="product_profile_product_card_trust_badge">
                    <span className="product_profile_product_card_trust_label">Trust score</span>
                    <span className="product_profile_product_card_trust_value">{trustScoreDisplay}</span>
                  </div>
                </div>
                <div className="product_profile_product_card_footer">
                  <button
                    type="button"
                    className="product_profile_product_card_view_btn"
                    onClick={() => handleViewProduct(product)}
                    aria-label={`View details for ${product.productName}`}
                  >
                    View details
                    <ChevronRight size={16} aria-hidden />
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </section>
      )}

      {viewProductModalOpen && (
        <div
          className="product_profile_modal_overlay"
          onClick={() => setViewProductModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product_profile_modal_title"
        >
          <div
            className="product_profile_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="product_profile_modal_header">
              <h2
                id="product_profile_modal_title"
                className="product_profile_modal_title"
              >
                {viewProductMeta?.productName ?? "Product details"}
              </h2>
              <button
                type="button"
                className="modal_close_btn"
                onClick={() => setViewProductModalOpen(false)}
                aria-label="Close"
              >
                <CircleX size={20} />
              </button>
            </div>
            <div className="product_profile_modal_body">
              {viewProductLoading && (
                <div
                  className="product_profile_loading"
                  style={{ padding: "2rem", textAlign: "center" }}
                >
                  Loading…
                </div>
              )}
              {!viewProductLoading && viewProductMeta && (
                <>
                  <div className="attestation_visible_status">
                    <div className="product_profile_modal_status_row">
                      <span className="product_profile_modal_status_label">
                        Attestation status
                      </span>
                      <span
                        className={`product_profile_product_card_status product_profile_product_card_status_${viewProductMeta.status.toLowerCase()}`}
                      >
                        {viewProductMeta.status}
                      </span>
                      <span className="product_profile_modal_status_sub">
                        {viewProductMeta.completedDate !== "—"
                          ? `Completed: ${viewProductMeta.completedDate}`
                          : "—"}
                      </span>
                    </div>
                    {viewProductMeta.status === "Completed" &&
                      onProductVisibilityToggle && (
                        <div className="product_profile_modal_visibility">
                          <button
                            type="button"
                            className="product_profile_toggle product_profile_product_toggle"
                            aria-pressed={viewProductMeta.visibleToBuyer}
                            onClick={() => {
                              const next = !viewProductMeta.visibleToBuyer;
                              onProductVisibilityToggle(
                                viewProductMeta.productId,
                                next,
                              );
                              setViewProductMeta((prev) =>
                                prev ? { ...prev, visibleToBuyer: next } : null,
                              );
                            }}
                            aria-label={`${viewProductMeta.visibleToBuyer ? "Hide" : "Show"} this product to buyers`}
                          />
                          <span className="product_profile_modal_visibility_label">
                            Visible to buyers
                          </span>
                        </div>
                      )}
                  </div>

                  {(() => {
                    const viewedProduct = products.find(
                      (p) => p.id === viewProductMeta.productId,
                    );
                    const modalReport =
                      asGeneratedReport(
                        viewedProduct?.generated_profile_report,
                      ) ??
                      asGeneratedReport(
                        (
                          viewProductDetail?.attestation as Record<
                            string,
                            unknown
                          >
                        )?.generated_profile_report,
                      );
                    return modalReport ? (
                      <div
                        className="product_profile_modal_generated_wrap"
                        style={{ marginTop: "1rem" }}
                      >
                        <GeneratedProductProfileCards
                          report={modalReport}
                          sectionVisibility={getSectionVisibility}
                        />
                      </div>
                    ) : null;
                  })()}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductProfileView;
