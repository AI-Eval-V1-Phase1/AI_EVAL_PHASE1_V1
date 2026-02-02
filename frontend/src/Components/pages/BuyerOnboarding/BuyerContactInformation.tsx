import React, { useState } from "react";
import {
  BUYER_DEPARTMENTS,
  BUYER_PRIMARY_ROLE,
  BUYER_HELPTEXT,
} from "../../../constants/buyerOnboardingData";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import HeaderForBuyer from "./HeaderForBuyer";
import ClickTooltip from "../../UI/ClickTooltip";
import { Info } from "lucide-react"; // assuming you use react-feather for the info icon

const BuyerContactInformation = ({formBuyerData, setFormBuyerData}) => {
  const title_vendor = "Contact Information";



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormBuyerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Primary Contact Name</span>
                  <ClickTooltip content={BUYER_HELPTEXT.primaryContactName}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              type="text"
              id="primaryContactName"
              name="primaryContactName"
              value={formBuyerData.primaryContactName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form_fields_vendor">
            <Input
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Primary Contact Email</span>
                  <ClickTooltip content={BUYER_HELPTEXT.primaryContactEmail}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              type="email"
              id="primaryContactEmail"
              name="primaryContactEmail"
              value={formBuyerData.primaryContactEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Primary Contact Role</span>
                  <ClickTooltip content={BUYER_HELPTEXT.primaryContactRole}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              default_option="Select primary role"
              options={BUYER_PRIMARY_ROLE}
              id="primaryContactRole"
              name="primaryContactRole"
              value={formBuyerData.primaryContactRole}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form_fields_vendor">
            <Select
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Department/Business Unit</span>
                  <ClickTooltip content={BUYER_HELPTEXT.departmentOwner}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              default_option="Select department/business unit"
              id="departmentOwner"
              name="departmentOwner"
              options={BUYER_DEPARTMENTS}
              value={formBuyerData.departmentOwner}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerContactInformation;
