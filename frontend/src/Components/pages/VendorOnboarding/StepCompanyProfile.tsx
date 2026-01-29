import Input from "../../UI/Input";
import HeaderForVendor from "./HeaderForVendor";
import Select from "../../UI/Select";
import { VENDOR_TYPES } from "../../../config/vendorOnboardingData";
import { VENDOR_MATURITY_LEVELS } from "../../../config/vendorOnboardingData";
import { INDUSTRY_SECTORS } from "../../../config/vendorOnboardingData";
import MultiSelectSubCategories  from "../../UI/MultiSelectSubCategories";

const StepCompanyProfile = () => {
  return (
    <>
      <HeaderForVendor
        className="header_for_vendor"
        title_vendor="Company Profile"
        sub_title_vendor="Tell us about your AI products and services"
      />

      {/* <div className="step_form_body"> */}
      <div>
        {/* <div className="step_form_right"> */}
        <div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  Vendor Type <span className="mandatory">*</span>
                </>
              }
              id="vendor_type"
              name="vendor_type"
              value=""
              default_option="Select vendor type"
              options={VENDOR_TYPES}
            />
          </div>

          <div className="form_fields_vendor">
            <MultiSelectSubCategories
              labelName={
                <>
                  Industry Sector <span className="mandatory">*</span>
                </>
              }
              id="industry_sec"
              // name="industry_sec"
              // value=""
              default_option="Select industry sector"
              options={INDUSTRY_SECTORS}
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  Vendor Maturity Stage <span className="mandatory">*</span>
                </>
              }
              id="vendor_type"
              name="vendor_type"
              value=""
              default_option="Select vendor maturity stage"
              options={VENDOR_MATURITY_LEVELS}
            />
          </div>
        </div>
        {/* <div className="step_form_left"> */}
        <div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Company Website <span className="mandatory">*</span>
                </>
              }
              type="text"
              id="company_website"
              name="company_website"
              value=""
              onChange={() => console.log("company_website")}
            />
          </div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Company Description<span className="mandatory">*</span>
                </>
              }
              type="textarea"
              id="company_description"
              name="company_description"
              value=""
              onChange={() => console.log("company_description")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StepCompanyProfile;
