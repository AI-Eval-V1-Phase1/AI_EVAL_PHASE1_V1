import React from "react";
<<<<<<< HEAD
import { BUYER_COTS_FIELD_KEYS } from "../../../../constants/buyerCotsAssessmentKeys";
import { BUYER_COTS_ASSESSMENT } from "../../../../constants/buyerCOTSData 1";
import { formatPreviewValue } from "../../../../utils/formatPreviewValue";
import FileUpload from "../../../UI/FileUpload";
import "../../VendorOnboarding/StepVendorOnboardingPreview.css";
=======
import PreviewTable from "../../../preview/PreviewTable";
import type { PreviewField } from "../../../../types/preview";
import { BUYER_COTS_FIELD_KEYS } from "../../../../constants/buyerCotsAssessmentKeys";
import HeaderForBuyer from "../../BuyerOnboarding/HeaderForBuyer";
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8

const MULTISELECT_KEYS = [
  "integrationSystems",
  "techStack",
  "implementationTeamComposition",
  "regulatoryRequirements",
  "impactedStakeholders",
  "vendorCertifications",
  "operatingRegions",
];

<<<<<<< HEAD
type FormData = Record<string, string>;

// Auto-Generated step commented out in flow; omit from review sections
const SECTION_ORDER: (keyof typeof BUYER_COTS_FIELD_KEYS)[] = [
  "organizationProfile",
  "useCase",
  "vendorEvaluation",
  "readiness",
  "riskProfile",
  "vendorRisk",
  "implementation",
  "evidence",
];

const SECTION_TITLES: Record<string, string> = {
  organizationProfile: "Organization Profile",
  useCase: "Use Case",
  vendorEvaluation: "Vendor Evaluation",
  readiness: "Readiness",
  riskProfile: "Risk Profile",
  vendorRisk: "Vendor Risk",
  implementation: "Implementation",
  evidence: "Evidence",
};

function getPreviewValue(data: FormData, key: string): unknown {
=======
function getPreviewValue(data: Record<string, string>, key: string): string | string[] | null | undefined {
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
  const v = data[key];
  if (v == null || String(v).trim() === "") return undefined;
  if (MULTISELECT_KEYS.includes(key)) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : String(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

<<<<<<< HEAD
function isUploadField(config: { label?: string; placeholder?: string; options?: unknown }): boolean {
  const label = (config.label ?? "").toLowerCase();
  const placeholder = (config.placeholder ?? "").toLowerCase();
  return !config.options && (label.includes("upload") || placeholder.includes("upload"));
}

function parseFileNamesValue(value: string | undefined): string[] {
  if (value == null || String(value).trim() === "") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

interface StepBuyerCotsPreviewProps {
  formData: FormData;
  title?: string;
  subTitle?: string;
  icon?: React.ReactNode;
}

function StepBuyerCotsPreview({ formData }: StepBuyerCotsPreviewProps) {
  return (
    <div className="vendor_preview">
      <p className="vendor_preview_intro">
        Review your information below. Submit when everything looks correct.
      </p>
      <div className="vendor_preview_sections">
        {SECTION_ORDER.map((sectionKey) => {
          const keys = BUYER_COTS_FIELD_KEYS[sectionKey];
          const sectionData = BUYER_COTS_ASSESSMENT[sectionKey] as Record<
            number,
            { label?: string; placeholder?: string; options?: unknown }
          > | undefined;
          const title = SECTION_TITLES[sectionKey] ?? sectionKey;
          if (!keys?.length) return null;

          return (
            <section key={sectionKey} className="vendor_preview_card">
              <h3 className="vendor_preview_card_title">{title}</h3>
              <dl className="vendor_preview_list">
                {keys.map((key, i) => {
                  const config = sectionData?.[i];
                  const label = config?.label ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                  const uploadField = config && isUploadField(config);

                  if (uploadField) {
                    const fileNames = parseFileNamesValue(formData[key]);
                    return (
                      <div key={key} className="vendor_preview_row">
                        <dt className="vendor_preview_label">{label}</dt>
                        <dd className="vendor_preview_value">
                          <FileUpload value={fileNames} readOnly />
                        </dd>
                      </div>
                    );
                  }

                  const value = getPreviewValue(formData, key);
                  return (
                    <div key={key} className="vendor_preview_row">
                      <dt className="vendor_preview_label">{label}</dt>
                      <dd className="vendor_preview_value">
                        {formatPreviewValue(value, label)}
                      </dd>
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
=======
type FormData = Record<string, string>;

const PREVIEW_SECTIONS: { title: string; fields: PreviewField<FormData>[] }[] = [
  {
    title: "Organization Profile",
    fields: BUYER_COTS_FIELD_KEYS.organizationProfile.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (d) => getPreviewValue(d, key),
    })),
  },
  {
    title: "Use Case",
    fields: BUYER_COTS_FIELD_KEYS.useCase.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (d) => getPreviewValue(d, key),
    })),
  },
  {
    title: "Vendor Evaluation",
    fields: BUYER_COTS_FIELD_KEYS.vendorEvaluation.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (d) => getPreviewValue(d, key),
    })),
  },
  {
    title: "Readiness",
    fields: BUYER_COTS_FIELD_KEYS.readiness.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (d) => getPreviewValue(d, key),
    })),
  },
  {
    title: "Risk Profile",
    fields: BUYER_COTS_FIELD_KEYS.riskProfile.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (d) => getPreviewValue(d, key),
    })),
  },
  {
    title: "Vendor Risk",
    fields: BUYER_COTS_FIELD_KEYS.vendorRisk.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (d) => getPreviewValue(d, key),
    })),
  },
  {
    title: "Implementation",
    fields: BUYER_COTS_FIELD_KEYS.implementation.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (d) => getPreviewValue(d, key),
    })),
  },
  {
    title: "Evidence",
    fields: BUYER_COTS_FIELD_KEYS.evidence.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (d) => getPreviewValue(d, key),
    })),
  },
  {
    title: "Auto Generated",
    fields: BUYER_COTS_FIELD_KEYS.autoGenerated.map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      value: (d) => getPreviewValue(d, key),
    })),
  },
];

const StepBuyerCotsPreview = ({
  formData,
  title,
  subTitle,
  icon,
}: {
  formData: Record<string, string>;
  title?: string;
  subTitle?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title ?? "Review"}
        sub_title_vendor={subTitle}
        icon={icon}
      />
      {PREVIEW_SECTIONS.map((section) => (
        <div key={section.title} style={{ marginBottom: 24 }}>
          <PreviewTable<FormData>
            dataForPreview={formData}
            previewFields={section.fields}
            previewTitle={section.title}
          />
        </div>
      ))}
    </div>
  );
};
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8

export default StepBuyerCotsPreview;
