import React from "react";
import Input from "../../UI/Input";
import HeaderForVendor from "./HeaderForVendor";

const StepGeopgraphy = () => {
  return (
    <>
      {/* <div className="step_form_header">
        <h2>Geography</h2>
        <p>All the fields are mandatory</p>
      </div> */}

      <HeaderForVendor
        title_vendor="Geography"
        sub_title_vendor="All the fields are mandatory"
      />
      <div className="step_form_body">
        {/* <div className="step_form_right"> when the fields are more than 2 uncomment this remove the below line */}
        <div className="align_form_center">
          <div className="form_fields">
            <Input
              labelName="Headquarters Location"
              type="text"
              id="headquarters_loc"
              name="headquarters_loc"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields">
            <Input
              labelName="Operating Regions"
              type="operating_reg"
              id="operating_reg"
              name="operating_reg"
              value=""
              onChange=""
            />
          </div>
          {/* <div className="step_form_left">
        
        </div> */}
        </div>
      </div>
    </>
  );
};

export default StepGeopgraphy;
