import React from "react";
import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";
import MultiSelectDropDown from "../../UI/MultiSelectDropDown";
import {
  BUYER_DATA_CLASSIFICATION_LEVELS_HANDLED,
  BUYER_PII_SENSITIVE_DATA_HANDLING,
  BUYER_PRIMARY_REGULATORY_FRAMEWORKS,
  BUYER_REGULATORY_PENALTY_EXPOSURE,
} from "../../../config/buyerOnboardingData";

const RegulatoryContext = () => {
  const title_vendor = "Regulatory Context";

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />
      {/* <div className="step_form_body align_form_center"> */}
      <div className="step_form_body">
        <div className="step_form_right">
          <div className="form_fields_vendor">
            <MultiSelectDropDown
              labelName={
                <>
                  Primary Regulatory Frameworks
                  <span className="mandatory">*</span>
                </>
              }
              id="regulatoryFrameworks"
              name="regulatoryFrameworks"
              default_option="Select  primary regulatory frameworks"
              options={BUYER_PRIMARY_REGULATORY_FRAMEWORKS}
              value=""
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  Regulatory Penalty Exposure
                  <span className="mandatory">*</span>
                </>
              }
              type="text"
              id="penaltyExposure"
              name="penalty_Exposure"
              value=""
              default_option="Select regulatory penalty exposure"
              options={BUYER_REGULATORY_PENALTY_EXPOSURE}
              onChange=""
              required
            />
          </div>
        </div>
        <div >
          <div className="form_fields_vendor">
            <MultiSelectDropDown
              labelName={
                <>
                  Data Classification Levels Handled
                  <span className="mandatory">*</span>
                </>
              }
              id="dataClassification"
              name="data_Classification"
              value=""
              default_option="Select data classification levels handled"
              options={BUYER_DATA_CLASSIFICATION_LEVELS_HANDLED}
              onChange=""
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  PII/Sensitive Data Handling
                  <span className="mandatory">*</span>
                </>
              }
              id="pii_phi_handling"
              name="pii_phi_Handling"
              default_option="Select  pii/sensitive data handling"
              value=""
              onChange=""
              options={BUYER_PII_SENSITIVE_DATA_HANDLING}
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegulatoryContext;
