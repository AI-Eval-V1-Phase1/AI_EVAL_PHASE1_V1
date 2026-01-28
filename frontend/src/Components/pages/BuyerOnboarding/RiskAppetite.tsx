import React from "react";
import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";

const RiskAppetite = () => {
  const title_vendor = "Risk Appetite"

 const Risk_Appetite = ["Conservative","Moderate","Aggressive"].map(
    (Risk_Appetite) => ({
      label: Risk_Appetite,
      value: Risk_Appetite,
    }),
  );

  return (
    <>
      <div className="step_form_header">
        {/* <h2>Risk Appetite</h2> */}
        {/* <p>All the fields are mandatory</p> */}
        <HeaderForBuyer title_vendor={title_vendor} />
      </div>
      {/* <div className="step_form_body align_form_center"> */}
      <div className="align_form_center">
        <div className="step_form_right">
          <div className="form_fields">
            
            <Select
            labelName="AI Risk Appetite*"
              type="text"
              id="aiRiskAppetite"
              name="ai_Risk_Appetite"
              value=""
              default_option="Select"
              options={Risk_Appetite}
              onChange=""
            />
          </div>
          <div className="form_fields">
            <Input
              labelName="Acceptable Risk Level*"
              type="text"
              id="riskLevel"
              name="risk_Level"
              value=""
              onChange=""
            />
          </div>
         
        </div>
       
      </div>
    </>
  );
};

export default RiskAppetite;
