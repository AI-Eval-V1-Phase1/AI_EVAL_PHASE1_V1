/**
 * Vendor Self Attestation – Evidence & Supporting Documentation tab content.
 * Includes optional file upload for testing and policy documentation.
 * Heading, subheading, and icon from step config (Vendor Onboarding UI pattern).
 */
import type { ReactNode } from "react";
import AttestationDynamicStep from "../AttestationDynamicStep";
import FormField from "../../../UI/FormField";
import FileUpload from "../../../UI/FileUpload";
import type { VendorSelfAttestationPayload } from "../../../../types/vendorSelfAttestation";
import type { DocumentUploadState } from "../../../../types/vendorSelfAttestation";
import { EVIDENCE_TESTING_POLICY_HELPER_TEXT, MAX_FILE_SIZE_BYTES } from "../../../../constants/vendorAttestationDocumentConstants";

export interface TabEvidenceSupportingDocProps {
  attestation: VendorSelfAttestationPayload;
  setAttestation: React.Dispatch<React.SetStateAction<VendorSelfAttestationPayload>>;
  documentUpload: DocumentUploadState;
  setDocumentUpload: React.Dispatch<React.SetStateAction<DocumentUploadState>>;
  data: Record<string, { label: string; placeholder?: string; required?: boolean }>;
  fieldErrors?: Record<string, string>;
  title?: string;
  subTitle?: string;
  icon?: ReactNode;
}

function TabEvidenceSupportingDoc({
  attestation,
  setAttestation,
  documentUpload,
  setDocumentUpload,
  data,
  fieldErrors,
  title = "Evidence & Supporting Documentation",
  subTitle,
  icon,
}: TabEvidenceSupportingDocProps) {
  return (
    <>
      <AttestationDynamicStep
        title={title}
        subTitle={subTitle}
        icon={icon}
        sectionKey="evidence_supporting_documentation"
        data={data}
        attestation={attestation}
        setAttestation={setAttestation}
        fieldErrors={fieldErrors}
      />
      <div className="form_fields_vendor" style={{ marginTop: "1.5rem" }}>
        <FormField
          label="Upload Testing and Policy Documentation (Optional)"
          mandatory={false}
          tooltipText={EVIDENCE_TESTING_POLICY_HELPER_TEXT}
        >
          <p
            className="evidence-helper"
            style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}
          >
            {EVIDENCE_TESTING_POLICY_HELPER_TEXT}
          </p>
          <FileUpload
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            maxSizeBytes={MAX_FILE_SIZE_BYTES}
            value={documentUpload?.evidenceTestingPolicy ?? []}
            onFilesChange={(fileNames) =>
              setDocumentUpload((prev) => ({
                ...prev,
                evidenceTestingPolicy: fileNames,
              }))
            }
          />
        </FormField>
      </div>
    </>
  );
}

export default TabEvidenceSupportingDoc;
