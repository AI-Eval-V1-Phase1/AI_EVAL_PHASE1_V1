// import React, { useState } from "react";
import {
  BUYER_ANNUAL_REVENUE,
  BUYER_EMPLOYEE_COUNTS,
  BUYER_HELPTEXT,
} from "../../../constants/buyerOnboardingData";
// import Input from "../../UI/Input";
import Select from "../../UI/Select";
import YearPicker from "../../UI/YearPicker";
import HeaderForBuyer from "./HeaderForBuyer";
import ClickTooltip from "../../UI/ClickTooltip";
import { Info } from "lucide-react";

const BuyerOrganizationScale = ({formBuyerData, setFormBuyerData}) => {
  const title_vendor = "Organization Scale";
  const startYear = 1950;



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
            <Select
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Organization Size</span>
                  <ClickTooltip content={BUYER_HELPTEXT.organizationSize}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              id="employeeCount"
              name="employeeCount"
              value={formBuyerData.employeeCount}
              default_option="Select organization size"
              options={BUYER_EMPLOYEE_COUNTS}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form_fields_vendor">
            <Select
              labelName={
                <div className="labelSection">
                  <span>Annual Revenue Range</span>
                  <ClickTooltip content={BUYER_HELPTEXT.annualRevenue}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              id="annualRevenue"
              name="annualRevenue"
              value={formBuyerData.annualRevenue}
              default_option="Select annual revenue range"
              options={BUYER_ANNUAL_REVENUE}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form_fields_vendor">
          <YearPicker
            label={
              <div className="labelSection">
                <span>Year Founded</span>
                <ClickTooltip content={BUYER_HELPTEXT.yearFounded}>
                  <Info size={14} color="#6B7280" />
                </ClickTooltip>
              </div>
            }
            id="yearFounded"
            name="yearFounded"
            startYear= {startYear}
            value={formBuyerData.yearFounded}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default BuyerOrganizationScale;
