// import React from "react";
import {
  BUYER_DEPARTMENTS,
  BUYER_PRIMARY_ROLE,
} from "../../../config/buyerOnboardingData";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import HeaderForBuyer from "./HeaderForBuyer";

const BuyerContactInformation = () => {
  const title_vendor = "Contact Information";

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />
      <div>
        <div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Primary Contact Name<span className="mandatory">*</span>
                </>
              }
              type="text"
              id="primary_contact_name"
              name="primary_contact_name"
              value=""
              onChange=""
              required
            />
          </div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Primary Contact Email<span className="mandatory">*</span>
                </>
              }
              type="email"
              id="primary_contact_email"
              name="primary_contact_email"
              value=""
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
                  Primary Contact Role<span className="mandatory">*</span>
                </>
              }
              default_option="Select primary role"
              options={BUYER_PRIMARY_ROLE}
              id="primary_contact_role"
              name="primary_contact_role"
              value=""
              onChange=""
              required
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  Department/Business Unit<span className="mandatory">*</span>
                </>
              }
              default_option="Select department/business unit"
              id="dept_Business_Role"
              name="dept_BusinessRole"
              options={BUYER_DEPARTMENTS}
              value=""
              onChange=""
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerContactInformation;
