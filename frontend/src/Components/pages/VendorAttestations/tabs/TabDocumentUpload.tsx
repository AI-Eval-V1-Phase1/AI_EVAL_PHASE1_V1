/**
 * Vendor Self Attestation – Document Upload tab content.
 * Heading, subheading, and icon from step config (Vendor Onboarding UI pattern).
 */
import type { ReactNode } from "react";
import StepDocUpload from "../StepDocUpload";
import type { DocumentUploadState } from "../../../../types/vendorSelfAttestation";

export interface TabDocumentUploadProps {
  documentUpload: DocumentUploadState;
  setDocumentUpload: React.Dispatch<React.SetStateAction<DocumentUploadState>>;
  documentUploadConfig: Record<string, { label: string; placeholder?: string; required?: boolean }>;
  attestationId?: string | null;
  onUploadDocument?: (attestationId: string, file: File) => Promise<string>;
  title?: string;
  subTitle?: string;
  icon?: ReactNode;
}

function TabDocumentUpload({
  documentUpload,
  setDocumentUpload,
  documentUploadConfig,
  attestationId,
  onUploadDocument,
  title,
  subTitle,
  icon,
}: TabDocumentUploadProps) {
  return (
    <StepDocUpload
      data={documentUploadConfig}
      documentUpload={documentUpload}
      setDocumentUpload={setDocumentUpload}
      attestationId={attestationId}
      onUploadDocument={onUploadDocument}
      title={title}
      subTitle={subTitle}
      icon={icon}
    />
  );
}

export default TabDocumentUpload;
