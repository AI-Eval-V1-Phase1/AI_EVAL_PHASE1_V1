import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";
import {
  BUYER_AI_GOVERNANCE_MATURITY,
  BUYER_AI_SKILLS_AVAILABILITY,
  BUYER_CHANGE_MANAGEMENT_CAPABILITY,
  BUYER_DATA_GOVERNANCE_MATURITY,
  BUYER_EXISTING_AI_INITIATIVES,
} from "../../../config/buyerOnboardingData";

const CurrentAiMaturity = () => {
  const title_vendor = "Current AI Maturity";

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />
      {/* <div className="step_form_body align_form_center"> */}
      <div>
        <div>
          <div className="form_fields_vendor">
            <Select
              labelName="Existing AI Initiatives"
              default_option="Select existing ai initiatives"
              options={BUYER_EXISTING_AI_INITIATIVES}
              id="existingInitiative"
              name="existing_Initiative"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  AI Governance Maturity<span className="mandatory">*</span>
                </>
              }
              id="aiGovernance"
              name="ai_Governance"
              value=""
              default_option="Select ai governance maturity"
              options={BUYER_AI_GOVERNANCE_MATURITY}
              onChange=""
              required
            />
          </div>
         

          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  Data Governance Maturity<span className="mandatory">*</span>
                </>
              }
              type="text"
              id="dataGovernance"
              name="dataGovernance"
              value=""
              default_option="Select data governance maturity"
              options={BUYER_DATA_GOVERNANCE_MATURITY}
              onChange=""
              required
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  AI Skills Availability<span className="mandatory">*</span>
                </>
              }
              type="text"
              id="dataGovernance"
              name="dataGovernance"
              value=""
              default_option="Select ai skills availability"
              options={BUYER_AI_SKILLS_AVAILABILITY}
              onChange=""
              required
            />
          </div>
        </div>
        <div>
          <div className="form_fields_vendor">
          
            <Select
              
          labelName={
                <>
                Change Management Capability<span className="mandatory">*</span>
                </>
              }
              type="text"
              id="inhouseSkills"
              name="inhouse_Skills"
              value=""
              default_option="Select change management capability"
              options={BUYER_CHANGE_MANAGEMENT_CAPABILITY}
              onChange=""
            />
          </div>
          {/* <div className="form_fields_vendor">
          
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
          </div> */}
        </div>
      </div>
    </>
  );
};

export default CurrentAiMaturity;
