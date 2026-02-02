// Import the React library to use JSX and React types in this component. JSX compiles to React.createElement under the hood. :contentReference[oaicite:2]{index=2}
import React from "react";

// Import our reusable table component that renders labeled fields in a preview layout.
import PreviewTable from "../../preview/PreviewTable";

// Import the shared type defining the vendor form data shape for type safety in this component.
import type { BuyerDataInterface } from "../../../types/formDataBuyer";

// Import the preview sections configuration, defining section titles and fields to display.
import {BUYER_PREVIEW_SECTIONS} from "../../../constants/buyerOnboardingData";
interface StepVendorOnboardingPreviewProps {
  formBuyerData: BuyerDataInterface;
}

const StepBuyerOnboardingPreview: React.FC<
  StepVendorOnboardingPreviewProps
> = ({ formBuyerData }) => {
  return (
    <div>
      {BUYER_PREVIEW_SECTIONS.map((section) => (
        <div key={section.title} style={{ marginBottom: 24 }}>
          <PreviewTable<BuyerDataInterface>
            dataForPreview={formBuyerData}
            previewFields={section.fields}
            previewTitle={section.title}
          />
        </div>
      ))}
    </div>
  );
};

export default StepBuyerOnboardingPreview;
