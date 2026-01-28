import React from "react";
import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";

const CurrentAiMaturity = () => {
  const title_vendor = "Current AI Maturity";
  const AI_Maturity = ["None", "Basic", "Intermediate", "Advanced"].map(
    (AI_Maturity) => ({
      label: AI_Maturity,
      value: AI_Maturity,
    }),
  );
  const Data_Governance = ["Ad-hoc", "Defined", "Managed", "Optimized"].map(
    (Data_Governance) => ({
      label: Data_Governance,
      value: Data_Governance,
    }),
  );
  const AI_Skills = ["None", "Limited", "Moderate", "Strong"].map(
    (AI_Skills) => ({
      label: AI_Skills,
      value: AI_Skills,
    }),
  );

  return (
    <>
      <div className="step_form_header">
        {/* <h2>Current AI Maturity</h2> */}
        {/* <p>All the fields are mandatory</p> */}
        <HeaderForBuyer title_vendor={title_vendor} />
      </div>
      {/* <div className="step_form_body align_form_center"> */}
      <div className="step_form_body">
        <div className="step_form_right">
          <div className="buyer_form_fields">
            <Input
              labelName="Existing AI Initiatives"
              type="text"
              id="existingInitiative"
              name="existing_Initiative"
              value=""
              onChange=""
            />
          </div>
          <div className="buyer_form_fields">
            {/* <Input
              labelName="AI Governance Maturity Level*"
              type="text"
              id="aiGovernance"
              name="ai_Governance"
              value=""
              onChange=""
            /> */}
            <Select
              labelName="AI Governance Maturity Level*"
              id="aiGovernance"
              name="ai_Governance"
              value=""
              default_option="Select"
              options={AI_Maturity}
              onChange=""
            />
          </div>
          <div className="buyer_form_fields">
            <Input
              labelName="Change Management Capability*"
              type="text"
              id="managementCapability"
              name="managementCapability"
              value=""
              onChange=""
            />
          </div>
        </div>
        <div className="step_form_left">
          <div className="buyer_form_fields">
            <Select
              labelName="Data Governance Maturity*"
              type="text"
              id="dataGovernance"
              name="dataGovernance"
              value=""
              default_option="Select"
              options={Data_Governance}
              onChange=""
            />
          </div>
          <div className="buyer_form_fields">
            {/* <Input
              labelName="In-house AI/ML Skills*"
              type="text"
              id="inhouseSkills"
              name="inhouse_Skills"
              value=""
              onChange=""
            /> */}
            <Select
              labelName="In-house AI/ML Skills*"
              type="text"
              id="inhouseSkills"
              name="inhouse_Skills"
              value=""
              default_option="Select"
              options={AI_Skills}
              onChange=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentAiMaturity;
