import Input from "../../UI/Input";
import HeaderForVendor from "./HeaderForVendor";
// import type EMPLOYEE_COUNTS from
import {EMPLOYEE_COUNTS} from "../../../config/vendor";
import Select from "../../UI/Select";

const StepCompanyScale = () => {
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
            default_option = "Select EmployeeCount"
             id="emp_count"
            name="emp_count"
            value=""
            onChange=""
          />
          
        </div>
        <div className="form_fields_vendor">
          <Input
            labelName="Year Founded"
            type="year_founded"
            id="year_founded"
            name="year_founded"
            value=""
            onChange=""
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
