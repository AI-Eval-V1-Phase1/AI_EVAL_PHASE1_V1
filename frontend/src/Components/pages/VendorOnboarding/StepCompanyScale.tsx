import HeaderForVendor from "./HeaderForVendor";
import { EMPLOYEE_COUNTS } from "../../../constants/vendorOnboardingData";
import Select from "../../UI/Select";
import YearPicker from "../../UI/YearPicker";
import type { FormChangeEvent, StepPropsVendorData } from "../../../types/formDataVendor";

const StepCompanyScale = ({ formVendorData, setFormVendorData }: StepPropsVendorData) => {
  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    // Convert year to number
    const newValue = name === "yearFounded" ? (value ? parseInt(value, 10) : undefined) : value;
    setFormVendorData({ ...formVendorData, [name]: newValue });
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <HeaderForVendor className="header_for_vendor" title_vendor="Company Scale" />

      <div className="align_form_center1">
        <div className="form_fields_vendor">
          <Select
            labelName={
              <>
                <span className="mandatory">*</span> Employee Count
              </>
            }
            options={EMPLOYEE_COUNTS}
            default_option="Select employee count"
            id="employeeCount"
            name="employeeCount"
            value={formVendorData.employeeCount || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form_fields_vendor">
          <YearPicker
            startYear={1950}
            endYear={currentYear}
            label={
              <>
                <span className="mandatory">*</span> Year Founded
              </>
            }
            name="yearFounded"
            id="yearFounded"
            value={formVendorData.yearFounded}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default StepCompanyScale;
