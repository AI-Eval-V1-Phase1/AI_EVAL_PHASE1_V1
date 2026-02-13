/**
 * Preview step for Vendor Self Attestation: shows Company Profile, Document Uploads, and all attestation data.
 * Uses the same UI as Vendor Onboarding preview (vendor_preview cards). Document rows keep View/Edit actions.
 */
import React from "react";
import { Eye, Pencil } from "lucide-react";
import type { VendorSelfAttestationFormState } from "../../../types/vendorSelfAttestation";
import { VENDOR_SELF_ATTESTATION } from "../../../constants/vendorAttestionData";
import { ATTESTATION_SECTION_FIELDS } from "../../../constants/vendorAttestationFields";
import { formatPreviewValueAsString } from "../../../utils/formatPreviewValue";
import "../VendorOnboarding/StepVendorOnboardingPreview.css";
import "./vendor_attestation_preview.css";

/** Step index for Document Upload section; step for Evidence & Supporting Documentation (Testing and Policy upload). */
const STEP_DOCUMENT_UPLOAD = 1;
const STEP_EVIDENCE = 9;

interface StepVendorSelfAttestationPrevProps {
  formState: VendorSelfAttestationFormState;
  /** When provided, edit icon navigates to the given step (Document Upload = 1, Evidence = 9). */
  onNavigateToStep?: (step: number) => void;
  /** When provided, document names in Document Uploads are clickable and open the document. */
  attestationId?: string | null;
  /** Called when user clicks a document name; receives file name. Use to fetch with auth and open in new tab. */
  onOpenDocument?: (fileName: string) => void;
}

/** User-friendly preview: multi-select/industry/dependent dropdown as readable text, never raw array or JSON. */
function formatValue(val: unknown): string {
  return formatPreviewValueAsString(val);
}

function StepVendorSelfAttestationPrev({ formState, onNavigateToStep, attestationId, onOpenDocument }: StepVendorSelfAttestationPrevProps) {
  const { companyProfile, attestation, documentUpload } = formState;

  const canOpenDocument = Boolean(attestationId && onOpenDocument);

  const renderDocumentValue = (names: string[]) => {
    if (!names?.length) return "N/A";
    if (canOpenDocument) {
      return (
        <>
          {names.map((name, idx) => (
            <span key={`${name}-${idx}`}>
              {idx > 0 && ", "}
              <button
                type="button"
                className="preview-doc-link"
                onClick={() => onOpenDocument?.(name)}
              >
                {name}
              </button>
            </span>
          ))}
        </>
      );
    }
    return names.join(", ");
  };

  /** Actions for a document row: View (navigate to section) and Edit (navigate to section). */
  const DocumentRowActions = ({ step }: { step: number }) => {
    if (!onNavigateToStep) return null;
    return (
      <span className="preview-doc-actions">
        <button
          type="button"
          className="preview-view-btn"
          onClick={() => onNavigateToStep(step)}
          title="View section"
        >
          <Eye size={14} aria-hidden />
          <span style={{ marginLeft: "0.25rem" }}>View</span>
        </button>
        <button
          type="button"
          className="preview-edit-icon"
          onClick={() => onNavigateToStep(step)}
          title="Edit this section"
          aria-label="Edit this section"
        >
          <Pencil size={14} aria-hidden />
        </button>
      </span>
    );
  };

  const companyProfileRows: { label: string; value: string }[] = [
    { label: "Vendor Type", value: formatValue(companyProfile.vendorType) },
    { label: "Vendor Maturity", value: formatValue(companyProfile.vendorMaturity) },
    { label: "Company Website", value: formatValue(companyProfile.companyWebsite) },
    { label: "Company Description", value: formatValue(companyProfile.companyDescription) },
    { label: "Employee Count", value: formatValue(companyProfile.employeeCount) },
    { label: "Year Founded", value: formatValue(companyProfile.yearFounded) },
    { label: "Headquarters", value: formatValue(companyProfile.headquartersLocation) },
    { label: "Operating Regions", value: formatValue(companyProfile.operatingRegions) },
  ];

  return (
    <div className="vendor_preview vendor-attestation-preview">
      <p className="vendor_preview_intro">
        Review your attestation below.
      </p>
      <div className="vendor_preview_sections">
        {/* Company Profile */}
        <section className="vendor_preview_card">
          <h3 className="vendor_preview_card_title">Company Profile</h3>
          <dl className="vendor_preview_list">
            {companyProfileRows.map((row) => (
              <div key={row.label} className="vendor_preview_row">
                <dt className="vendor_preview_label">{row.label}</dt>
                <dd className="vendor_preview_value">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Document Uploads: same UI as Company Profile (dl list) */}
        <section className="vendor_preview_card">
          <h3 className="vendor_preview_card_title">Document Uploads</h3>
          <dl className="vendor_preview_list">
            <div className="vendor_preview_row">
              <dt className="vendor_preview_label">
                <span className="vendor_preview_doc_label">
                  <span>{VENDOR_SELF_ATTESTATION.document_upload["0"]?.label ?? "Marketing and Product Material"}</span>
                  <DocumentRowActions step={STEP_DOCUMENT_UPLOAD} />
                </span>
              </dt>
              <dd className="vendor_preview_value">{renderDocumentValue(documentUpload?.["0"] ?? [])}</dd>
            </div>
            <div className="vendor_preview_row">
              <dt className="vendor_preview_label">
                <span className="vendor_preview_doc_label">
                  <span>{VENDOR_SELF_ATTESTATION.document_upload["1"]?.label ?? "Technical Product Specifications Material"}</span>
                  <DocumentRowActions step={STEP_DOCUMENT_UPLOAD} />
                </span>
              </dt>
              <dd className="vendor_preview_value">{renderDocumentValue(documentUpload?.["1"] ?? [])}</dd>
            </div>
            {/* Regulatory (2): each category as its own row */}
            {documentUpload?.["2"]?.categories?.map((category) => {
              const names = documentUpload["2"]?.byCategory?.[category] ?? [];
              return (
                <div key={category} className="vendor_preview_row">
                  <dt className="vendor_preview_label">
                    <span className="vendor_preview_doc_label">
                      <span>{VENDOR_SELF_ATTESTATION.document_upload["2"]?.label ?? "Regulatory and Compliance Certification Material"} — {category}</span>
                      <DocumentRowActions step={STEP_DOCUMENT_UPLOAD} />
                    </span>
                  </dt>
                  <dd className="vendor_preview_value">{renderDocumentValue(names)}</dd>
                </div>
              );
            })}
            {(!documentUpload?.["2"]?.categories?.length) && (
              <div className="vendor_preview_row">
                <dt className="vendor_preview_label">
                  <span className="vendor_preview_doc_label">
                    <span>{VENDOR_SELF_ATTESTATION.document_upload["2"]?.label ?? "Regulatory and Compliance Certification Material"}</span>
                    <DocumentRowActions step={STEP_DOCUMENT_UPLOAD} />
                  </span>
                </dt>
                <dd className="vendor_preview_value">N/A</dd>
              </div>
            )}
            <div className="vendor_preview_row">
              <dt className="vendor_preview_label">
                <span className="vendor_preview_doc_label">
                  <span>Testing and Policy Documentation</span>
                  <DocumentRowActions step={STEP_EVIDENCE} />
                </span>
              </dt>
              <dd className="vendor_preview_value">{renderDocumentValue(documentUpload?.evidenceTestingPolicy ?? [])}</dd>
            </div>
          </dl>
        </section>

        {/* Attestation sections (dynamic fields) */}
        {Object.entries(ATTESTATION_SECTION_FIELDS).map(([sectionKey, mappings]) => {
          const sectionData = (VENDOR_SELF_ATTESTATION as Record<string, Record<string, { label: string }>>)[sectionKey];
          if (!sectionData || !mappings.length) return null;
          const title = sectionKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const entries = Object.entries(sectionData)
            .filter(([k]) => k !== "length" && Object.prototype.hasOwnProperty.call(sectionData, k))
            .sort((a, b) => Number(a[0]) - Number(b[0]));
          return (
            <section key={sectionKey} className="vendor_preview_card">
              <h3 className="vendor_preview_card_title">{title}</h3>
              <dl className="vendor_preview_list">
                {entries.map(([dataIndexStr, fieldConfig]) => {
                  const dataIndex = Number(dataIndexStr);
                  const mapping = mappings[dataIndex];
                  if (!mapping) return null;
                  const val = attestation[mapping.key];
                  return (
                    <div key={mapping.key} className="vendor_preview_row">
                      <dt className="vendor_preview_label">{fieldConfig.label}</dt>
                      <dd className="vendor_preview_value">{formatValue(val)}</dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default StepVendorSelfAttestationPrev;
