import React from 'react'
import Input from '../../UI/Input';
import HeaderForVendor from './HeaderForVendor';
const StepCompanyProfile = () => {
  return (
    <>
    <HeaderForVendor title_vendor="Company Profile" sub_title_vendor="All the fields are mandatory"/>
    
      <div className="step_form_body">
      <div className="step_form_right">
        <div className="form_fields">
          <Input
            labelName="Vendor Type"
            type="text"
            id="vendor_type"
            name="vendor_type"
            value=""
            onChange=""
          />
        </div>
        <div className="form_fields">
          <Input
            labelName="Vendor Maturity Stage"
            type="text"
            id="vendor_maturity_stage"
            name="vendor_maturity_stage"
            value=""
            onChange=""
          />
        </div>
       
      </div>
      <div className="step_form_left">
         <div className="form_fields">
          <Input
            labelName="Company Website"
            type="text"
            id="company_website"
            name="company_website"
            value=""
            onChange=""
          />
        </div>
        <div className="form_fields">
          <Input
            labelName="Company Description"
            type="text"
            id="company_description"
            name="company_description"
            value=""
            onChange=""
          />
        </div>
       
        </div>
      </div>
    </>
  );
}

export default StepCompanyProfile