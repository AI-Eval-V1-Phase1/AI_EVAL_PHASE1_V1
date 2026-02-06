/**
 * Renders a step of the Vendor Self Attestation form with dynamic text inputs.
 * Each field is bound to attestation state via ATTESTATION_SECTION_FIELDS.
 * Used for all sections except Company Profile (step 0) and Document Upload (step 1).
 */
import type { ChangeEvent } from "react";
import HeaderForVendor from "../VendorOnboarding/HeaderForVendor";
import FormField from "../../UI/FormField";
import Input from "../../UI/Input";
import {
  ATTESTATION_SECTION_FIELDS,
  type AttestationFieldMapping,
} from "../../../constants/vendorAttestationFields";
import type { VendorSelfAttestationPayload } from "../../../types/vendorSelfAttestation";

export interface AttestationDynamicStepProps {
  title: string;
  sectionKey: string;
  /** Section config: array of { label, placeholder, required } */
  data: Record<string, { label: string; placeholder?: string; required?: boolean }>;
  attestation: VendorSelfAttestationPayload;
  setAttestation: React.Dispatch<React.SetStateAction<VendorSelfAttestationPayload>>;
}

function getValue(
  attestation: VendorSelfAttestationPayload,
  mapping: AttestationFieldMapping
): string {
  const v = attestation[mapping.key];
  if (v == null) return "";
  if (Array.isArray(v)) return v.length ? String(v[0]) : "";
  return String(v);
}

function setValue(
  mapping: AttestationFieldMapping,
  value: string,
  prev: VendorSelfAttestationPayload
): VendorSelfAttestationPayload {
  const next = { ...prev };
  if (mapping.type === "array") {
    (next as Record<string, unknown>)[mapping.key] = value ? [value] : [];
  } else {
    (next as Record<string, unknown>)[mapping.key] = value || null;
  }
  return next;
}

const AttestationDynamicStep = ({
  title,
  sectionKey,
  data,
  attestation,
  setAttestation,
}: AttestationDynamicStepProps) => {
  const sectionFields = ATTESTATION_SECTION_FIELDS[sectionKey];
  if (!sectionFields) return null;

  const dataEntries = Object.entries(data).filter(
    ([k]) => k !== "length" && Object.prototype.hasOwnProperty.call(data, k)
  );
  const sortedEntries = dataEntries.sort(
    (a, b) => Number(a[0]) - Number(b[0])
  );

  return (
    <>
      <HeaderForVendor className="header_for_vendor" title_vendor={title} />
      <div className="step_form_body">
        {sortedEntries.map(([dataIndexStr, fieldConfig]) => {
          const dataIndex = Number(dataIndexStr);
          const mapping = sectionFields[dataIndex] ?? null;
          if (mapping == null) return null;
          const value = getValue(attestation, mapping);
          return (
            <div key={dataIndex} className="form_fields_vendor">
              <FormField
                label={fieldConfig.label}
                mandatory={fieldConfig.required ?? false}
                tooltipText={fieldConfig.placeholder}
              >
                <Input
                  labelName=""
                  type="textarea"
                  id={`attestation-${sectionKey}-${dataIndex}`}
                  name={mapping.key}
                  value={value}
                  onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    setAttestation((prev) =>
                      setValue(mapping, e.target.value, prev)
                    );
                  }}
                />
              </FormField>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AttestationDynamicStep;
