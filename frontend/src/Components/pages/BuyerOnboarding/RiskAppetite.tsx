import React from "react";
import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";
import { BUYER_ACCEPTABLE_RISK_LEVEL, BUYER_AI_RISK_APPETITE, BUYER_AI_SKILLS_AVAILABILITY } from "../../../config/buyerOnboardingData";

const RiskAppetite = () => {
  const title_vendor = "Risk Appetite"


  return (
    <>
          <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />
      {/* <div className="step_form_body align_form_center"> */}
   
        <div >
          <div className="form_fields_vendor">
            
            <Select
            labelName={
                <>
                 AI Risk Appetite<span className="mandatory">*</span>
                </>
              }
              type="text"
              id="aiRiskAppetite"
              name="ai_Risk_Appetite"
              value=""
              default_option="Select ai risk appetite"
              options={BUYER_AI_RISK_APPETITE}
              onChange=""
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                Acceptable Risk Level<span className="mandatory">*</span>
                </>
              }
              default_option="Select acceptable risk level"
              id="riskLevel"
              name="risk_Level"
              options={BUYER_ACCEPTABLE_RISK_LEVEL}
              value=""
              onChange=""
            />
          </div>
         
        </div>
       
    
    </>
  );
};

export default RiskAppetite;
