
import HeaderForBuyer from "./HeaderForBuyer";
import MultiSelectDropDown from "../../UI/MultiSelectDropDown";
import { BUYER_EXISTING_TECHNOLOGY_STACK } from "../../../config/buyerOnboardingData";

const TechnicalEnvironment = () => {
  const title_vendor = "Technical Environment";

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />
      {/* <div className="step_form_body align_form_center"> */}
      {/* <div className="align_form_center"> */}
        <div >
          <div className="form_fields_vendor">
            <MultiSelectDropDown
              labelName="Existing Technology Stack"
              id="existingTech"
              // name="existingTech"
              value=""
              onChange=""
              default_option="Select existing technology stack"
              options={BUYER_EXISTING_TECHNOLOGY_STACK}
            />
          </div>
          {/* <div className="form_fields_vendor">
            <Input
              labelName="Regulatory Penalty Exposure*"
              type="text"
              id="penaltyExposure"
              name="penalty_Exposure"
              value=""
              onChange=""
            />
          </div> */}
        </div>
      {/* </div> */}
    </>
  );
};

export default TechnicalEnvironment;
