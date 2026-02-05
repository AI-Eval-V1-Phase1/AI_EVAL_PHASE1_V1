import HeaderForVendor from "./HeaderForVendor";
import { EMPLOYEE_COUNTS, VENDOR_HELPTEXT } from "../../../constants/vendorOnboardingData";
import Select from "../../UI/Select";
import YearPicker from "../../UI/YearPicker";
import type { FormChangeEvent, StepPropsVendorData } from "../../../types/formDataVendor";
import { Info } from "lucide-react";
import ClickTooltip from "../../UI/ClickTooltip";

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
        {/* Employee Count */}
        <div className="form_fields_vendor">
          <Select
            labelName={
              <div className="labelSection">
                <span className="mandatory">*</span>
                <span>Employee Count</span>
                <ClickTooltip content={VENDOR_HELPTEXT.employeeCount}>
                  <Info size={14} color="#6B7280" />
                </ClickTooltip>
              </div>
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

        {/* Year Founded */}
        <div className="form_fields_vendor">
          <YearPicker
            startYear={1950}
            endYear={currentYear}
            label={
              <div className="labelSection">
                <span className="mandatory">*</span>
                <span>Year Founded</span>
                <ClickTooltip content={VENDOR_HELPTEXT.yearFounded}>
                  <Info size={14} color="#6B7280" />
                </ClickTooltip>
              </div>
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
