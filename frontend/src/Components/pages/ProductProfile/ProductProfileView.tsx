/**
 * Product Profile view for vendors: summary cards (Trust Score, No of products, Company, Regions),
 * product cards with kebab "View Product", and View Product modal with attestation details.
 */
import { useState } from "react";
import {
  Shield,
  FileCheck,
  Building2,
  Globe,
  Cpu,
  ShieldCheck,
  Database,
  FlaskConical,
  FileText,
  Package,
  X,
} from "lucide-react";
import type { VendorSelfAttestationFormState } from "../../../types/vendorSelfAttestation";
import ProductProfileSummaryCard from "./ProductProfileSummaryCard";
import KebabMenu from "../../UI/KebabMenu";
import type { ProductProfileProduct } from "../DirectoryListing/DirectoryListing";
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

export interface ProductProfileViewProps {
  formState: VendorSelfAttestationFormState | null;
  /** List of products (attestations) for product cards */
  products?: ProductProfileProduct[];
  /** Fetch full attestation detail by id for View Product modal */
  fetchProductDetail?: (id: string) => Promise<VendorSelfAttestationFormState | null>;
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
  onSectionVisibilityChange?: (attestationId: string, sectionKey: SectionVisibilityKey, value: boolean) => Promise<void>;
}

export type SectionVisibilityKey =
  | "visible_ai_governance"
  | "visible_security_posture"
  | "visible_data_privacy"
  | "visible_compliance"
  | "visible_model_risk";

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
}: ProductProfileViewProps) {
  const [viewProductModalOpen, setViewProductModalOpen] = useState(false);
  const [viewProductDetail, setViewProductDetail] = useState<VendorSelfAttestationFormState | null>(null);
  const [viewProductMeta, setViewProductMeta] = useState<{
    productName: string;
    status: string;
    completedDate: string;
    productId: string;
    visibleToBuyer: boolean;
  } | null>(null);
  const [viewProductLoading, setViewProductLoading] = useState(false);

  const company = formState?.companyProfile;
  const attestation = formState?.attestation ?? {};

  const companyName = company?.companyDescription
    ? truncate(formatVal(company.companyDescription), 40)
    : "Not specified.";
  const vendorType = formatVal(company?.vendorType) || "SaaS Provider";
  const operatingRegions =
    Array.isArray(company?.operatingRegions) && company.operatingRegions.length > 0
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

  const detailItem = (label: string, value: string) => (
    <li key={label} className="product_profile_detail_item">
      <span className="product_profile_detail_label">{label}:</span>{" "}
      <span className="product_profile_detail_value">{value}</span>
    </li>
  );

  const aiGovernanceItems = [
    ["AI Ethics Policy", formatVal(attestation.unique_value_proposition) || "Not specified."],
    ["AI Ethics Board", formatVal(attestation.human_oversight) || "Not specified."],
    ["Human Oversight", formatVal(attestation.human_oversight) || formatVal(attestation.decision_autonomy) || "Not specified."],
    ["Model Governance", formatVal(attestation.model_transparency) || formatVal(attestation.training_data_documentation) || "Not specified."],
  ];

  const securityItems = [
    ["Security Certifications", formatVal(attestation.security_certifications) || "Not specified."],
    ["Access Controls", formatVal(attestation.adversarial_security_testing) || "Not specified."],
    ["Vulnerability Management", formatVal(attestation.adversarial_security_testing) || "Not specified."],
    ["Incident History", formatVal(attestation.incident_response_plan) || "Not specified."],
  ];

  const dataPrivacyItems = [
    ["Data Types Processed", formatVal(attestation.pii_handling) || "Not specified."],
    ["Data Retention Policy", formatVal(attestation.data_retention_policy) || "Not specified."],
    ["Encryption Standards", formatVal(attestation.data_residency_options) || "Not specified."],
  ];

  const complianceItems = [
    ["Regulatory Frameworks", formatVal(attestation.security_certifications) || "Not specified."],
    ["Certifications", formatVal(attestation.security_certifications) || formatVal(attestation.assessment_completion_level) || "Not specified."],
    ["Audit History", formatVal(attestation.assessment_completion_level) || "Not specified."],
  ];

  const modelRiskItems = [
    ["Training Data Sources", formatVal(attestation.training_data_documentation) || "Not specified."],
    ["Model Monitoring", formatVal(attestation.model_transparency) || formatVal(attestation.rollback_capability) || "Not specified."],
    ["Bias Testing", formatVal(attestation.bias_testing_approach) || "Not specified."],
    ["Explainability", formatVal(attestation.model_transparency) || formatVal(attestation.decision_autonomy) || "Not specified."],
  ];

  const buildDetailItemsFromAttestation = (att: Record<string, unknown>) => ({
    aiGovernance: [
      ["AI Ethics Policy", formatVal(att.unique_value_proposition) || "Not specified."],
      ["AI Ethics Board", formatVal(att.human_oversight) || "Not specified."],
      ["Human Oversight", formatVal(att.human_oversight) || formatVal(att.decision_autonomy) || "Not specified."],
      ["Model Governance", formatVal(att.model_transparency) || formatVal(att.training_data_documentation) || "Not specified."],
    ],
    security: [
      ["Security Certifications", formatVal(att.security_certifications) || "Not specified."],
      ["Access Controls", formatVal(att.adversarial_security_testing) || "Not specified."],
      ["Vulnerability Management", formatVal(att.adversarial_security_testing) || "Not specified."],
      ["Incident History", formatVal(att.incident_response_plan) || "Not specified."],
    ],
    dataPrivacy: [
      ["Data Types Processed", formatVal(att.pii_handling) || "Not specified."],
      ["Data Retention Policy", formatVal(att.data_retention_policy) || "Not specified."],
      ["Encryption Standards", formatVal(att.data_residency_options) || "Not specified."],
    ],
    compliance: [
      ["Regulatory Frameworks", formatVal(att.security_certifications) || "Not specified."],
      ["Certifications", formatVal(att.security_certifications) || formatVal(att.assessment_completion_level) || "Not specified."],
      ["Audit History", formatVal(att.assessment_completion_level) || "Not specified."],
    ],
    modelRisk: [
      ["Training Data Sources", formatVal(att.training_data_documentation) || "Not specified."],
      ["Model Monitoring", formatVal(att.model_transparency) || formatVal(att.rollback_capability) || "Not specified."],
      ["Bias Testing", formatVal(att.bias_testing_approach) || "Not specified."],
      ["Explainability", formatVal(att.model_transparency) || formatVal(att.decision_autonomy) || "Not specified."],
    ],
  });

  const modalDetail = viewProductDetail ? buildDetailItemsFromAttestation(viewProductDetail.attestation ?? {}) : null;

  const attRecord = viewProductDetail?.attestation as Record<string, unknown> | undefined;
  /** Section visibility toggles default to off; only on when explicitly true. */
  const sectionVisible = (key: SectionVisibilityKey) => attRecord?.[key] === true;
  const handleSectionToggle = async (key: SectionVisibilityKey, next: boolean) => {
    if (!viewProductMeta || !onSectionVisibilityChange) return;
    await onSectionVisibilityChange(viewProductMeta.productId, key, next);
    if (fetchProductDetail) {
      const detail = await fetchProductDetail(viewProductMeta.productId);
      setViewProductDetail(detail);
    }
  };

  return (
    <div className="sec_user_page attestation_page org_settings_page product_profile_page">
      <div className="heading_user_page page_header_align">
        <div className="headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <FileText size={24} />
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

      <section className="product_profile_summary_cards">
        <ProductProfileSummaryCard
          title="Trust Score"
          icon={<Shield size={24} />}
          primary={trustScore}
          secondary={`${compliancePercent} compliance`}
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
          iconColor="purple"
        />
      </section>

      {products.length > 0 && (
        <section className="product_profile_products_section">
          <h2 className="product_profile_products_heading">Products</h2>
          <div className="product_profile_product_cards">
            {products.map((product) => (
              <div key={product.id} className="product_profile_product_card">
                <div className="product_profile_product_card_content">
                  <div className="product_profile_product_card_title_row">
                    <span className="product_profile_product_card_icon" aria-hidden>
                      {productInitials(product.productName)}
                    </span>
                    <h3 className="product_profile_product_card_title">{product.productName}</h3>
                  </div>
                  <span className={`product_profile_product_card_status product_profile_product_card_status_${product.status.toLowerCase()}`}>
                    {product.status}
                  </span>
                </div>
                <div className="product_profile_product_card_actions">
                  <KebabMenu
                    ariaLabel={`Actions for ${product.productName}`}
                    options={[
                      {
                        label: "View Product",
                        onClick: () => handleViewProduct(product),
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
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
              <h2 id="product_profile_modal_title" className="product_profile_modal_title">
                {viewProductMeta?.productName ?? "Product details"}
              </h2>
              <button
                type="button"
                className="product_profile_modal_close"
                onClick={() => setViewProductModalOpen(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="product_profile_modal_body">
              {viewProductLoading && (
                <div className="product_profile_loading" style={{ padding: "2rem", textAlign: "center" }}>
                  Loading…
                </div>
              )}
              {!viewProductLoading && viewProductMeta && (
                <>
                  <div className="product_profile_modal_status_row">
                    <span className="product_profile_modal_status_label">Attestation status</span>
                    <span className={`product_profile_product_card_status product_profile_product_card_status_${viewProductMeta.status.toLowerCase()}`}>
                      {viewProductMeta.status}
                    </span>
                    <span className="product_profile_modal_status_sub">
                      {viewProductMeta.completedDate !== "—" ? `Completed: ${viewProductMeta.completedDate}` : "—"}
                    </span>
                  </div>
                  {viewProductMeta.status === "Completed" && onProductVisibilityToggle && (
                    <div className="product_profile_modal_visibility">
                      <span className="product_profile_modal_visibility_label">Visible to buyers</span>
                      <button
                        type="button"
                        className="product_profile_toggle product_profile_product_toggle"
                        aria-pressed={viewProductMeta.visibleToBuyer}
                        onClick={() => {
                          const next = !viewProductMeta.visibleToBuyer;
                          onProductVisibilityToggle(viewProductMeta.productId, next);
                          setViewProductMeta((prev) => (prev ? { ...prev, visibleToBuyer: next } : null));
                        }}
                        aria-label={`${viewProductMeta.visibleToBuyer ? "Hide" : "Show"} this product to buyers`}
                      />
                    </div>
                  )}
                  {modalDetail && (
                    <div className="product_profile_detail_grid">
                      <div className="product_profile_detail_card">
                        <div className="product_profile_detail_card_header">
                          <FlaskConical className="product_profile_detail_icon product_profile_icon_purple" size={24} aria-hidden />
                          <div className="product_profile_detail_card_header_content">
                            <div>
                              <h3 className="product_profile_detail_title">AI Governance</h3>
                              <p className="product_profile_detail_subtitle">Ethics, oversight, and governance practices.</p>
                            </div>
                            {viewProductMeta.status === "Completed" && onSectionVisibilityChange && (
                              <div className="product_profile_detail_card_toggle">
                                <span className="product_profile_detail_card_toggle_label">Visible to buyers</span>
                                <button
                                  type="button"
                                  className="product_profile_toggle product_profile_product_toggle"
                                  aria-pressed={sectionVisible("visible_ai_governance")}
                                  onClick={() => handleSectionToggle("visible_ai_governance", !sectionVisible("visible_ai_governance"))}
                                  aria-label="Toggle AI Governance visible to buyers"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <ul className="product_profile_detail_list">
                          {modalDetail.aiGovernance.map(([label, value]) => detailItem(label, truncate(value, 200)))}
                        </ul>
                      </div>
                      <div className="product_profile_detail_card">
                        <div className="product_profile_detail_card_header">
                          <ShieldCheck className="product_profile_detail_icon product_profile_icon_blue" size={24} aria-hidden />
                          <div className="product_profile_detail_card_header_content">
                            <div>
                              <h3 className="product_profile_detail_title">Security Posture</h3>
                              <p className="product_profile_detail_subtitle">Security controls and certifications.</p>
                            </div>
                            {viewProductMeta.status === "Completed" && onSectionVisibilityChange && (
                              <div className="product_profile_detail_card_toggle">
                                <span className="product_profile_detail_card_toggle_label">Visible to buyers</span>
                                <button
                                  type="button"
                                  className="product_profile_toggle product_profile_product_toggle"
                                  aria-pressed={sectionVisible("visible_security_posture")}
                                  onClick={() => handleSectionToggle("visible_security_posture", !sectionVisible("visible_security_posture"))}
                                  aria-label="Toggle Security Posture visible to buyers"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <ul className="product_profile_detail_list">
                          {modalDetail.security.map(([label, value]) => detailItem(label, truncate(value, 200)))}
                        </ul>
                      </div>
                      <div className="product_profile_detail_card">
                        <div className="product_profile_detail_card_header">
                          <Database className="product_profile_detail_icon product_profile_icon_green" size={24} aria-hidden />
                          <div className="product_profile_detail_card_header_content">
                            <div>
                              <h3 className="product_profile_detail_title">Data Privacy</h3>
                              <p className="product_profile_detail_subtitle">Data handling and privacy practices.</p>
                            </div>
                            {viewProductMeta.status === "Completed" && onSectionVisibilityChange && (
                              <div className="product_profile_detail_card_toggle">
                                <span className="product_profile_detail_card_toggle_label">Visible to buyers</span>
                                <button
                                  type="button"
                                  className="product_profile_toggle product_profile_product_toggle"
                                  aria-pressed={sectionVisible("visible_data_privacy")}
                                  onClick={() => handleSectionToggle("visible_data_privacy", !sectionVisible("visible_data_privacy"))}
                                  aria-label="Toggle Data Privacy visible to buyers"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <ul className="product_profile_detail_list">
                          {modalDetail.dataPrivacy.map(([label, value]) => detailItem(label, truncate(value, 200)))}
                        </ul>
                      </div>
                      <div className="product_profile_detail_card">
                        <div className="product_profile_detail_card_header">
                          <FileCheck className="product_profile_detail_icon product_profile_icon_green" size={24} aria-hidden />
                          <div className="product_profile_detail_card_header_content">
                            <div>
                              <h3 className="product_profile_detail_title">Compliance</h3>
                              <p className="product_profile_detail_subtitle">Regulatory frameworks and certifications.</p>
                            </div>
                            {viewProductMeta.status === "Completed" && onSectionVisibilityChange && (
                              <div className="product_profile_detail_card_toggle">
                                <span className="product_profile_detail_card_toggle_label">Visible to buyers</span>
                                <button
                                  type="button"
                                  className="product_profile_toggle product_profile_product_toggle"
                                  aria-pressed={sectionVisible("visible_compliance")}
                                  onClick={() => handleSectionToggle("visible_compliance", !sectionVisible("visible_compliance"))}
                                  aria-label="Toggle Compliance visible to buyers"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <ul className="product_profile_detail_list">
                          {modalDetail.compliance.map(([label, value]) => detailItem(label, truncate(value, 200)))}
                        </ul>
                      </div>
                      <div className="product_profile_detail_card product_profile_detail_card_span_2">
                        <div className="product_profile_detail_card_header">
                          <Cpu className="product_profile_detail_icon product_profile_icon_purple" size={24} aria-hidden />
                          <div className="product_profile_detail_card_header_content">
                            <div>
                              <h3 className="product_profile_detail_title">Model Risk Management</h3>
                              <p className="product_profile_detail_subtitle">AI model governance and risk controls.</p>
                            </div>
                            {viewProductMeta.status === "Completed" && onSectionVisibilityChange && (
                              <div className="product_profile_detail_card_toggle">
                                <span className="product_profile_detail_card_toggle_label">Visible to buyers</span>
                                <button
                                  type="button"
                                  className="product_profile_toggle product_profile_product_toggle"
                                  aria-pressed={sectionVisible("visible_model_risk")}
                                  onClick={() => handleSectionToggle("visible_model_risk", !sectionVisible("visible_model_risk"))}
                                  aria-label="Toggle Model Risk Management visible to buyers"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="product_profile_model_risk_columns">
                          <ul className="product_profile_detail_list">
                            {modalDetail.modelRisk.slice(0, 2).map(([label, value]) => detailItem(label, truncate(value, 180)))}
                          </ul>
                          <ul className="product_profile_detail_list">
                            {modalDetail.modelRisk.slice(2, 4).map(([label, value]) => detailItem(label, truncate(value, 180)))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
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
