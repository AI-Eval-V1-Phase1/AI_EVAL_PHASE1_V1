import React from "react";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";
import MultiSelectDropDown from "../../UI/MultiSelectDropDown";
import ClickTooltip from "../../UI/ClickTooltip";
import { Info } from "lucide-react";
import {
  BUYER_PRIMARY_REGULATORY_FRAMEWORKS,
  BUYER_REGULATORY_PENALTY_EXPOSURE,
  BUYER_DATA_CLASSIFICATION_LEVELS_HANDLED,
  BUYER_PII_SENSITIVE_DATA_HANDLING,
  BUYER_HELPTEXT,
} from "../../../constants/buyerOnboardingData";

const RegulatoryContext = ({ formBuyerData, setFormBuyerData }) => {
  const title_vendor = "Regulatory Context";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormBuyerData({ ...formBuyerData, [name]: value });
  };

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />

      <div className="step_form_body">
        <div className="step_form_right">
          <div className="form_fields_vendor">
            <MultiSelectDropDown
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Primary Regulatory Frameworks</span>
                  <ClickTooltip
                    content={BUYER_HELPTEXT.primaryRegulatoryFrameworks}
                  >
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              id="primaryRegulatoryFrameworks"
              // name="primaryRegulatoryFrameworks"
              default_option="Select primary regulatory frameworks"
              options={BUYER_PRIMARY_REGULATORY_FRAMEWORKS}
              value={formBuyerData.primaryRegulatoryFrameworks || []}
               onChange={(selected: string[]) =>
                setFormBuyerData({
                  ...formBuyerData,
                  primaryRegulatoryFrameworks: selected,
                })
              }
            />
          </div>

          <div className="form_fields_vendor">
            <Select
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Regulatory Penalty Exposure</span>
                  <ClickTooltip
                    content={BUYER_HELPTEXT.regulatoryPenaltyExposure}
                  >
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              id="penaltyExposure"
              name="regulatoryPenaltyExposure"
              default_option="Select regulatory penalty exposure"
              options={BUYER_REGULATORY_PENALTY_EXPOSURE}
              value={formBuyerData.regulatoryPenaltyExposure || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <div className="form_fields_vendor">
            <MultiSelectDropDown
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Data Classification Levels Handled</span>
                  <ClickTooltip
                    content={BUYER_HELPTEXT.dataClassificationHandled}
                  >
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              id="dataClassificationHandled"
              // name="dataClassificationHandled"
              default_option="Select data classification levels handled"
              options={BUYER_DATA_CLASSIFICATION_LEVELS_HANDLED}
              value={formBuyerData.dataClassificationHandled || []}
              onChange={(selected: string[]) =>
                setFormBuyerData({
                  ...formBuyerData,
                  dataClassificationHandled: selected,
                })
              }
            />
          </div>

          <div className="form_fields_vendor">
            <Select
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>PII/Sensitive Data Handling</span>
                  <ClickTooltip content={BUYER_HELPTEXT.piiHandling}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              id="pii_phi_handling"
              name="piiHandling"
              default_option="Select PII/Sensitive data handling"
              options={BUYER_PII_SENSITIVE_DATA_HANDLING}
              value={formBuyerData.piiHandling || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegulatoryContext;
