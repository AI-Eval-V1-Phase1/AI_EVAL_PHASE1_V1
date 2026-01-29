import Input from "../../UI/Input";
import HeaderForVendor from "./HeaderForVendor";
import Select from "../../UI/Select";
import { PRIMARY_CONTACT_ROLE } from "../../../config/vendorOnboardingData";

const StepContactInformation = () => {
  return (
    <>
      <HeaderForVendor
        className="header_for_vendor"
        title_vendor="Contact Information"
        // sub_title_vendor="Tell us about your AI products and services"
      />

      {/* <div className="step_form_body"> */}
      <div>
        {/* <div className="step_form_right"> */}
        <div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Primary Contact Name <span className="mandatory">*</span>
                </>
              }
              type="text"
              id="primary_contact_name"
              name="primary_contact_name"
              value=""
              onChange={() => console.log(" primary_contact_name")}
            />
          </div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Primary Contact Email <span className="mandatory">*</span>
                </>
              }
              type="email"
              id="primary_contact_email"
              name="primary_contact_email"
              value=""
              onChange={() => console.log("primary_contact_email count")}
            />
          </div>
        </div>
        {/* <div className="step_form_left"> */}
        <div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  Primary Contact Role <span className="mandatory">*</span>
                </>
              }
              
              id="primary_contact_role"
              name="primary_contact_role"
              default_option="Select primary role"
              options={PRIMARY_CONTACT_ROLE}
              value=""
              onChange={() => console.log("primary_contact_role count")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StepContactInformation;
