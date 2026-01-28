import React from "react";
import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";

const TechnicalEnvironment = () => {

const title_vendor = "Technical Environment"

  return (
    <>
      <div className="step_form_header">
        {/* <h2>Technical Environment</h2> */}
        {/* <p>All the fields are mandatory</p> */}
        <HeaderForBuyer title_vendor={title_vendor} />
      </div>
      {/* <div className="step_form_body align_form_center"> */}
      <div className="align_form_center">
        <div className="step_form_right">
          <div className="form_fields">
            <Input
              labelName="Existing Technology Stack"
              type="text"
              id="existingTech"
              name="existingTech"
              value=""
              onChange=""
            />
          </div>
          {/* <div className="form_fields">
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
       
      </div>
    </>
  );
};

export default TechnicalEnvironment;
