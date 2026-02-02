import Input from "../../UI/Input";
import HeaderForVendor from "./HeaderForVendor";
import Select from "../../UI/Select";
import { PRIMARY_CONTACT_ROLE } from "../../../constants/vendorOnboardingData";
import type {
  StepPropsVendorData,
  FormChangeEvent,
} from "../../../types/formDataVendor";

const StepContactInformation = ({
  formVendorData,
  setFormVendorData,
}: StepPropsVendorData) => {
  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setFormVendorData({ ...formVendorData, [name]: value });
  };
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
                  <span className="mandatory">*</span>Primary Contact Name
                </>
              }
              type="text"
              id="primaryContactName"
              name="primaryContactName"
              value={formVendorData.primaryContactName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  <span className="mandatory">*</span>Primary Contact Email
                </>
              }
              type="email"
              id="primaryContactEmail"
              name="primaryContactEmail"
              value={formVendorData.primaryContactEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* <div className="step_form_left"> */}
        <div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  <span className="mandatory">*</span>Primary Contact Role
                </>
              }
              id="primaryContactRole"
              name="primaryContactRole"
              default_option="Select primary role"
              options={PRIMARY_CONTACT_ROLE}
              value={formVendorData.primaryContactRole}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StepContactInformation;
