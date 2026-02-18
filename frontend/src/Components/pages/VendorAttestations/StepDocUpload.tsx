/**
 * Document Upload step: sections 0 and 1 are fixed file uploads (Marketing, Technical).
 * Regulatory and Compliance Certification Material is in the Compliance & Certifications tab.
 * Heading, subheading, and icon follow Vendor Onboarding UI pattern.
 */
import type { ReactNode } from "react";
import HeaderForVendor from "../VendorOnboarding/HeaderForVendor";
import FormField from "../../UI/FormField";
import FileUpload from "../../UI/FileUpload";
import {
  DOCUMENT_UPLOAD_HELPER_TEXT,
  MAX_FILE_SIZE_BYTES,
} from "../../../constants/vendorAttestationDocumentConstants";
import type { DocumentUploadState } from "../../../types/vendorSelfAttestation";

interface StepDocUploadProps {
  data: Record<string, { label: string; placeholder?: string; required?: boolean }>;
  documentUpload: DocumentUploadState;
  setDocumentUpload: React.Dispatch<React.SetStateAction<DocumentUploadState>>;
  title?: string;
  subTitle?: string;
  icon?: ReactNode;
}

const StepDocUpload = ({
  data,
  documentUpload,
  setDocumentUpload,
  title = "Document Upload",
  subTitle,
  icon,
}: StepDocUploadProps) => {
  const slot0 = documentUpload["0"] ?? [];
  const slot1 = documentUpload["1"] ?? [];

  const setSlot = (slot: "0" | "1", fileNames: string[]) => {
    setDocumentUpload((prev) => ({ ...prev, [slot]: fileNames }));
  };

  const label0 = data["0"]?.label ?? "Marketing and Product Material";
  const label1 = data["1"]?.label ?? "Technical Product Specifications Material";

  return (
    <>
      <HeaderForVendor
        title_vendor={title}
        sub_title_vendor={subTitle}
        icon={icon}
        className="header_for_vendor"
      />
      <p className="document-upload-helper" style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
        {DOCUMENT_UPLOAD_HELPER_TEXT}
      </p>

      {/* Section 0: Marketing and Product Material */}
      <div className="form_fields_vendor" style={{ marginBottom: "1rem" }}>
        <FormField label={label0} mandatory={data["0"]?.required ?? false} tooltipText={data["0"]?.placeholder}>
          <FileUpload
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            maxSizeBytes={MAX_FILE_SIZE_BYTES}
            value={slot0}
            onFilesChange={(fileNames) => setSlot("0", fileNames)}
          />
        </FormField>
      </div>

      {/* Section 1: Technical Product Specifications Material */}
      <div className="form_fields_vendor" style={{ marginBottom: "1.5rem" }}>
        <FormField label={label1} mandatory={data["1"]?.required ?? false} tooltipText={data["1"]?.placeholder}>
          <FileUpload
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            maxSizeBytes={MAX_FILE_SIZE_BYTES}
            value={slot1}
            onFilesChange={(fileNames) => setSlot("1", fileNames)}
          />
        </FormField>
      </div>
    </>
  );
};

export default StepDocUpload;
