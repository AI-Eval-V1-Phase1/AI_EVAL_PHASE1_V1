import React from "react";
import Input from "../../UI/Input";
import HeaderForVendor from "./HeaderForVendor";

const StepContactInformation = () => {
  return (
    <>
      {/* <div className="step_form_header">
        <h2>Contact Information</h2>
        <p>All the fields are mandatory</p>
      </div> */}

      <HeaderForVendor
        title_vendor="Contact Information"
        sub_title_vendor="All the fields are mandatory"
      />

      <div className="step_form_body">
        <div className="step_form_right">
          <div className="form_fields">
            <Input
              labelName="Primary Contact Name"
              type="text"
              id="primary_contact_name"
              name="primary_contact_name"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields">
            <Input
              labelName="Primary Contact Email"
              type="email"
              id="primary_contact_email"
              name="primary_contact_email"
              value=""
              onChange=""
            />
          </div>
        </div>
        <div className="step_form_left">
          <div className="form_fields">
            <Input
              labelName="Primary Contact Role"
              type="text"
              id="primary_contact_role"
              name="primary_contact_role"
              value=""
              onChange=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StepContactInformation;
