import React from "react";
import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";

const BuyerContactInformation = () => {

  const title_vendor = "Contact Information"

  return (
    <>
      <div className="step_form_header">
        {/* <h2>Contact Information</h2> */}
        {/* <p>All the fields are mandatory</p> */}
        <HeaderForBuyer title_vendor={title_vendor} />

      </div>
      <div className="step_form_body">
        <div className="step_form_right">
          <div className="form_fields">
            <Input
              labelName="Primary Contact Name*"
              type="text"
              id="primary_contact_name"
              name="primary_contact_name"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields">
            <Input
              labelName="Primary Contact Email*"
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
              labelName="Primary Contact Role*"
              type="text"
              id="primary_contact_role"
              name="primary_contact_role"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields">
            <Input
              labelName="Department/Business Role*"
              type="text"
              id="dept_Business_Role"
              name="dept_BusinessRole"
              value=""
              onChange=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerContactInformation;
