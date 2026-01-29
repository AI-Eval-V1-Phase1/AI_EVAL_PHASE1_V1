import { BUYER_INDUSTRY_SECTORS } from "../../../config/buyerOnboardingData";
import Input from "../../UI/Input";
import MultiSelectSubCategories from "../../UI/MultiSelectSubCategories";
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

  // const title_vendor = "Organization Profile"

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor="Organization Profile"
        sub_title_vendor="This information helps us tailor assessments to your context"
      />
      <div>
        <div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Organization Name <span className="mandatory">*</span>
                </>
              }
              type="text"
              id="orgName"
              name="org_Name"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  Organization Type<span className="mandatory">*</span>
                </>
              }
              type="text"
              id="org_Type"
              name="orgType"
              value=""
              default_option="Select"
              options={Org_Type}
              onChange=""
            />
          </div>
          
        </div>
        <div >
          <div className="form_fields_vendor">
           <MultiSelectSubCategories
           labelName={
                <>
                Industry Sector<span className="mandatory">*</span>
                </>
              }
          
           default_option = "Select industry sector"
           id="industry_sec"
           options={BUYER_INDUSTRY_SECTORS}
           
           
           />
          </div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Organization Website<span className="mandatory">*</span>
                </>
              }
              type="text"
              id="orgWeb"
              name="org_Web"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Organization Description<span className="mandatory">*</span>
                </>
              }
              type="textarea"
              id="orgDescription"
              name="org_Description"
              value=""
              onChange=""
            />
          </div>
        </div>
        {/* <div className="step_form_right">
          <div className="form_fields_vendor">
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
