import HeaderForVendor from "./HeaderForVendor";
// import type EMPLOYEE_COUNTS from
import { EMPLOYEE_COUNTS } from "../../../config/vendorOnboardingData";
import Select from "../../UI/Select";
import YearPicker from "../../UI/YearPicker";

const StepCompanyScale = () => {
  const currentYear = new Date().getFullYear();
  console.log(currentYear);

  return (
    <>
      <HeaderForVendor
        className="header_for_vendor"
        title_vendor="Company Scale"
      />
      {/* <div className="step_form_body align_form_center">  when you have the fields 4 uncomment this */}
      <div className="align_form_center1">
        {/* <div className="step_form_right"> */}
        <div className="form_fields_vendor">
          <Select
            labelName={
              <>
                Employee Count <span className="mandatory">*</span>
              </>
            }
            options={EMPLOYEE_COUNTS}
            default_option="Select employee count"
            id="emp_count"
            name="emp_count"
            value=""
            onChange={() => console.log("employee count")}
          />
        </div>
        <div className="form_fields_vendor">
          <YearPicker
            startYear={1950}
            label="Year Founded"
            endYear={currentYear}
            onChange={(year) => console.log("Selected year:", year)}
          />
        </div>
      </div>
      {/* <div className="step_form_left">
      
      
       
        </div> */}
      {/* </div> */}
    </>
  );
};

export default StepCompanyScale;
