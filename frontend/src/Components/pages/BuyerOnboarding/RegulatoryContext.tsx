import React from "react";
import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";

const RegulatoryContext = () => {
  const title_vendor = "Regulatory Context";

  const Penalty_Exposure = ["Low", "Medium", "High", "Severe"].map(
    (Penalty_Exposure) => ({
      label: Penalty_Exposure,
      value: Penalty_Exposure,
    }),
  );
  const Data_Classification = ["Public","Internal","Confidential","Restricted"].map(
    (Data_Classification) => ({
      label: Data_Classification,
      value: Data_Classification,
    }),
  );

  return (
    <>
      <div className="step_form_header">
        {/* <h2>Regulatory Context</h2> */}
        {/* <p>All the fields are mandatory</p> */}
        <HeaderForBuyer title_vendor={title_vendor} />
      </div>
      {/* <div className="step_form_body align_form_center"> */}
      <div className="step_form_body">
        <div className="step_form_right">
          <div className="form_fields">
            <Input
              labelName="Primary Regulatory Frameworks*"
              type="text"
              id="regulatoryFrameworks"
              name="regulatoryFrameworks"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields">
            
            <Select
              labelName="Regulatory Penalty Exposure*"
              type="text"
              id="penaltyExposure"
              name="penalty_Exposure"
              value=""
              default_option="Select"
              options={Penalty_Exposure}
              onChange=""
            />
          </div>
        </div>
        <div className="step_form_left">
          <div className="form_fields">
            
            <Select
              labelName="Data Classification Handled*"
              type="text"
              id="dataClassification"
              name="data_Classification"
              value=""
              default_option="Select"
              options={Data_Classification}
              onChange=""
            />
          </div>
          <div className="form_fields">
            <Input
              labelName="PII/PHI Handling*"
              type="text"
              id="pii_phi_handling"
              name="pii_phi_Handling"
              value=""
              onChange=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegulatoryContext;
