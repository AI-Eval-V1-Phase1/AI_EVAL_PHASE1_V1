/**
 * Document Upload step: sections 0 and 1 are fixed file uploads (Marketing, Technical);
 * section 2 (Regulatory and Compliance Certification Material) uses multi-select dropdown
 * with per-category file uploads. Helper text for formats and size on all sections.
 */
import HeaderForVendor from "../VendorOnboarding/HeaderForVendor";
import FormField from "../../UI/FormField";
import FileUpload from "../../UI/FileUpload";
import MultiSelectDropDown from "../../UI/MultiSelectDropDown";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_UPLOAD_HELPER_TEXT,
  MAX_FILE_SIZE_BYTES,
} from "../../../constants/vendorAttestationDocumentConstants";
import type { DocumentUploadState } from "../../../types/vendorSelfAttestation";

interface StepDocUploadProps {
  data: Record<string, { label: string; placeholder?: string; required?: boolean }>;
  documentUpload: DocumentUploadState;
  setDocumentUpload: React.Dispatch<React.SetStateAction<DocumentUploadState>>;
}

const StepDocUpload = ({ data, documentUpload, setDocumentUpload }: StepDocUploadProps) => {
  const slot0 = documentUpload["0"] ?? [];
  const slot1 = documentUpload["1"] ?? [];
  const regulatory = documentUpload["2"] ?? { categories: [], byCategory: {} };
  const categories = regulatory.categories ?? [];
  const byCategory = regulatory.byCategory ?? {};

  const setSlot = (slot: "0" | "1", fileNames: string[]) => {
    setDocumentUpload((prev) => ({ ...prev, [slot]: fileNames }));
  };

  const setRegulatoryCategories = (selected: string[]) => {
    setDocumentUpload((prev) => {
      const prev2 = prev["2"] ?? { categories: [], byCategory: {} };
      return {
        ...prev,
        "2": {
          categories: selected,
          byCategory: selected.reduce(
            (acc, cat) => ({ ...acc, [cat]: prev2.byCategory?.[cat] ?? [] }),
            {} as Record<string, string[]>
          ),
        },
      };
    });
  };

  const setFilesForCategory = (category: string, fileNames: string[]) => {
    setDocumentUpload((prev) => {
      const prev2 = prev["2"] ?? { categories: [], byCategory: {} };
      return {
        ...prev,
        "2": {
          ...prev2,
          byCategory: { ...(prev2.byCategory ?? {}), [category]: fileNames },
        },
      };
    });
  };

  const label0 = data["0"]?.label ?? "Marketing and Product Material";
  const label1 = data["1"]?.label ?? "Technical Product Specifications Material";
  const label2 = data["2"]?.label ?? "Regulatory and Compliance Certification Material";

  return (
    <>
      <HeaderForVendor title_vendor="Document Upload" className="header_for_vendor" />
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
      <div className="form_fields_vendor" style={{ marginBottom: "1rem" }}>
        <FormField label={label1} mandatory={data["1"]?.required ?? false} tooltipText={data["1"]?.placeholder}>
          <FileUpload
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            maxSizeBytes={MAX_FILE_SIZE_BYTES}
            value={slot1}
            onFilesChange={(fileNames) => setSlot("1", fileNames)}
          />
        </FormField>
      </div>

      {/* Section 2: Regulatory and Compliance Certification Material — multi-select + per-category upload */}
      <div className="form_fields_vendor" style={{ marginBottom: "1.5rem" }}>
        <FormField
          label={label2}
          mandatory={data["2"]?.required ?? false}
          tooltipText={data["2"]?.placeholder}
        >
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
            Select certification types and upload files for each. Accepted: PDF, DOCX, PPT. Max 10MB per file.
          </p>
          <MultiSelectDropDown
            id="regulatory-document-categories"
            labelName=""
            options={DOCUMENT_CATEGORIES}
            value={categories}
            default_option="Select document categories"
            onChange={setRegulatoryCategories}
          />
        </FormField>
      </div>
      {categories.length > 0 && (
        <div>
          {categories.map((category) => (
            <div key={category} className="form_fields_vendor" style={{ marginBottom: "1rem" }}>
              <FormField
                label={category}
                mandatory={false}
                tooltipText={`Upload files for ${category}. Accepted: PDF, DOCX, PPT. Max 10MB per file.`}
              >
                <FileUpload
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  maxSizeBytes={MAX_FILE_SIZE_BYTES}
                  value={byCategory[category] ?? []}
                  onFilesChange={(fileNames) => setFilesForCategory(category, fileNames)}
                />
              </FormField>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default StepDocUpload;
