import React from "react";
import HeaderForBuyer from "./HeaderForBuyer";
import MultiSelectDropDown from "../../UI/MultiSelectDropDown";
import ClickTooltip from "../../UI/ClickTooltip";
import { Info } from "lucide-react";
import {
  BUYER_EXISTING_TECHNOLOGY_STACK,
  BUYER_HELPTEXT,
} from "../../../constants/buyerOnboardingData";

const TechnicalEnvironment = ({ formBuyerData, setFormBuyerData }) => {
  const title_vendor = "Technical Environment";

  const handleChange = (selectedValues) => {
  setFormBuyerData({
    ...formBuyerData,
    existingTechStack: selectedValues, // directly update the field
  });
};


  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />

      <div className="form_fields_vendor">
        <MultiSelectDropDown
          labelName={
            <div className="labelSection">
              <span>Existing Technology Stack</span>
              <ClickTooltip content={BUYER_HELPTEXT.existingTechStack}>
                <Info size={14} color="#6B7280" />
              </ClickTooltip>
            </div>
          }
          id="existingTech"
          default_option="Select existing technology stack"
          options={BUYER_EXISTING_TECHNOLOGY_STACK}
          value={formBuyerData.existingTechStack || []}
          onChange={handleChange}
          // name="existingTechStack"
        />
      </div>
    </>
  );
};

export default TechnicalEnvironment;
