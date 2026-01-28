import React from "react";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import HeaderForBuyer from "./HeaderForBuyer";
const BuyerOrganizationProfile = () => {
const SECTORS = [
  "Healthcare & Medical",
  "Financial Services & Banking",
  "Government & Public Services",
  "Education & Research",
  "Retail & E-commerce",
  "Manufacturing & Supply Chain",
  "Transportation & Logistics",
  "Energy & Utilities",
  "Legal & Professional Services",
  "Media & Entertainment",
  "Technology & Software",
  "Telecommunications",
  "Defense & Security",
  "Other",
].map((sector) => ({
  label: sector,
  value: sector,
}));
const Org_Type = [
  "Enterprise",
  "SMB",
  "Startup",
  "Government",
  "Non-profit",
].map((Org_Type) => ({
  label: Org_Type,
  value: Org_Type,
}));


const title_vendor = "Organization Profile"

  return (
    <>
      <div className="step_form_header">
        {/* <h2>Organization Profile</h2> */}
        {/* <p>All the fields are mandatory</p> */}
        <HeaderForBuyer title_vendor={title_vendor} />
      </div>
      <div className="step_form_body">
        <div className="step_form_right">
          <div className="buyer_form_fields">
            <Input
              labelName="Organization Name*"
              type="text"
              id="orgName"
              name="org_Name"
              value=""
              onChange=""
            />
          </div>
          <div className="buyer_form_fields">
            
            <Select
               labelName="Organization Type*"
              type="text"
              id="org_Type"
              name="orgType"
              value=""
               default_option="Select"
              options={Org_Type}
              onChange=""
            />
          </div>
          <div className="buyer_form_fields">
            <Input
              labelName="Organization Description*"
              type="text"
              id="orgDescription"
              name="org_Description"
              value=""
             
              onChange=""
            />
          </div>
        </div>
        <div className="step_form_left">
          <div className="buyer_form_fields">
            {/* <Input
              labelName="Industry Sector*"
              type="text"
              id="orgIndustry"
              name="org_Industry"
              value=""
              onChange=""
            /> */}
            <Select
              labelName="Industry Sector*"
              name="industrySector"
              value=""
              default_option="Select"
              // options={[
              //   {
              //     label: "Healthcare & Medical",
              //     value: "Healthcare & Medical",
              //   },
              //   {
              //     label: "Financial Services & Banking",
              //     value: "Financial Services & Banking",
              //   },
              //   {
              //     label: "Government & Public Services",
              //     value: "Government & Public Services",
              //   },
              //   {
              //     label: "Education & Research",
              //     value: "Education & Research",
              //   },
              //   {
              //     label: "Education & Research",
              //     value: "Education & Research",
              //   },
              // ]}

              options={SECTORS}
              onChange=""
            />
          </div>
          <div className="buyer_form_fields">
            <Input
              labelName="Organization Website*"
              type="text"
              id="orgWeb"
              name="org_Web"
              value=""
              onChange=""
            />
          </div>
        </div>
        {/* <div className="step_form_right">
          <div className="buyer_form_fields">
            <Input
              labelName="Organization Description"
              type="text"
              id="orgDescription"
              name="org_Description"
              value=""
              onChange=""
            />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default BuyerOrganizationProfile;
