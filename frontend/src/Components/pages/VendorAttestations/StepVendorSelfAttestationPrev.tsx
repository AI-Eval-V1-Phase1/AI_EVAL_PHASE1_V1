/**
 * Preview step for Vendor Self Attestation: shows Company Profile, Document Uploads, and all attestation data.
 * For each document row: View button and edit icon; edit navigates back to the section that contains that document.
 */
import React from "react";
import { Eye, Pencil } from "lucide-react";
import type { VendorSelfAttestationFormState } from "../../../types/vendorSelfAttestation";
import { VENDOR_SELF_ATTESTATION } from "../../../constants/vendorAttestionData";
import { ATTESTATION_SECTION_FIELDS } from "../../../constants/vendorAttestationFields";
import "./vendor_attestation_preview.css";

/** Step index for Document Upload section; step for Evidence & Supporting Documentation (Testing and Policy upload). */
const STEP_DOCUMENT_UPLOAD = 1;
const STEP_EVIDENCE = 9;

interface StepVendorSelfAttestationPrevProps {
  formState: VendorSelfAttestationFormState;
  /** When provided, edit icon navigates to the given step (Document Upload = 1, Evidence = 9). */
  onNavigateToStep?: (step: number) => void;
}

function formatValue(val: unknown): string {
  if (val == null || val === "") return "N/A";
  if (Array.isArray(val)) return val.length ? val.join(", ") : "N/A";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

const StepVendorSelfAttestationPrev = ({ formState, onNavigateToStep }: StepVendorSelfAttestationPrevProps) => {
  const { companyProfile, attestation, documentUpload } = formState;

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

  return (
    <div className="vendor-attestation-preview">
      <h2 className="preview-main-title">Vendor Self Attestation – Preview</h2>

      {/* Company Profile */}
      <section className="preview-section">
        <h3 className="preview-title">Company Profile</h3>
        <table className="preview-table">
          <tbody>
            <tr><td className="preview-label">Vendor Type</td><td className="preview-value">{formatValue(companyProfile.vendorType)}</td></tr>
            <tr><td className="preview-label">Vendor Maturity</td><td className="preview-value">{formatValue(companyProfile.vendorMaturity)}</td></tr>
            <tr><td className="preview-label">Company Website</td><td className="preview-value">{formatValue(companyProfile.companyWebsite)}</td></tr>
            <tr><td className="preview-label">Company Description</td><td className="preview-value">{formatValue(companyProfile.companyDescription)}</td></tr>
            <tr><td className="preview-label">Employee Count</td><td className="preview-value">{formatValue(companyProfile.employeeCount)}</td></tr>
            <tr><td className="preview-label">Year Founded</td><td className="preview-value">{formatValue(companyProfile.yearFounded)}</td></tr>
            <tr><td className="preview-label">Headquarters</td><td className="preview-value">{formatValue(companyProfile.headquartersLocation)}</td></tr>
            <tr><td className="preview-label">Operating Regions</td><td className="preview-value">{formatValue(companyProfile.operatingRegions)}</td></tr>
          </tbody>
        </table>
      </section>

      {/* Document Uploads: slots 0, 1, 2 (2 = regulatory with categories) + Evidence Testing & Policy; View + edit per row */}
      <section className="preview-section preview-section--documents">
        <h3 className="preview-title">Document Uploads</h3>
        <table className="preview-table preview-table--documents">
          <tbody>
            <tr className="preview-doc-row">
              <td className="preview-label">
                <span className="preview-doc-label-text">
                  {VENDOR_SELF_ATTESTATION.document_upload["0"]?.label ?? "Marketing and Product Material"}
                </span>
                <DocumentRowActions step={STEP_DOCUMENT_UPLOAD} />
              </td>
              <td className="preview-value preview-value--doc">
                {documentUpload?.["0"]?.length ? documentUpload["0"].join(", ") : "N/A"}
              </td>
            </tr>
            <tr className="preview-doc-row">
              <td className="preview-label">
                <span className="preview-doc-label-text">
                  {VENDOR_SELF_ATTESTATION.document_upload["1"]?.label ?? "Technical Product Specifications Material"}
                </span>
                <DocumentRowActions step={STEP_DOCUMENT_UPLOAD} />
              </td>
              <td className="preview-value preview-value--doc">
                {documentUpload?.["1"]?.length ? documentUpload["1"].join(", ") : "N/A"}
              </td>
            </tr>
            {/* Regulatory (2): show each selected category with its files */}
            {documentUpload?.["2"]?.categories?.map((category) => {
              const names = documentUpload["2"]?.byCategory?.[category] ?? [];
              return (
                <tr key={category} className="preview-doc-row">
                  <td className="preview-label">
                    <span className="preview-doc-label-text">
                      {VENDOR_SELF_ATTESTATION.document_upload["2"]?.label ?? "Regulatory and Compliance Certification Material"} — {category}
                    </span>
                    <DocumentRowActions step={STEP_DOCUMENT_UPLOAD} />
                  </td>
                  <td className="preview-value preview-value--doc">{names.length ? names.join(", ") : "N/A"}</td>
                </tr>
              );
            })}
            {(!documentUpload?.["2"]?.categories?.length) && (
              <tr className="preview-doc-row">
                <td className="preview-label">
                  <span className="preview-doc-label-text">
                    {VENDOR_SELF_ATTESTATION.document_upload["2"]?.label ?? "Regulatory and Compliance Certification Material"}
                  </span>
                  <DocumentRowActions step={STEP_DOCUMENT_UPLOAD} />
                </td>
                <td className="preview-value preview-value--doc">N/A</td>
              </tr>
            )}
            <tr className="preview-doc-row">
              <td className="preview-label">
                <span className="preview-doc-label-text">Testing and Policy Documentation</span>
                <DocumentRowActions step={STEP_EVIDENCE} />
              </td>
              <td className="preview-value preview-value--doc">
                {(documentUpload?.evidenceTestingPolicy?.length ?? 0) > 0
                  ? (documentUpload?.evidenceTestingPolicy ?? []).join(", ")
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
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
          <section key={sectionKey} className="preview-section">
            <h3 className="preview-title">{title}</h3>
            <table className="preview-table">
              <tbody>
                {entries.map(([dataIndexStr, fieldConfig]) => {
                  const dataIndex = Number(dataIndexStr);
                  const mapping = mappings[dataIndex];
                  if (!mapping) return null;
                  const val = attestation[mapping.key];
                  return (
                    <tr key={mapping.key}>
                      <td className="preview-label">{fieldConfig.label}</td>
                      <td className="preview-value">{formatValue(val)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
};

export default StepVendorSelfAttestationPrev;
