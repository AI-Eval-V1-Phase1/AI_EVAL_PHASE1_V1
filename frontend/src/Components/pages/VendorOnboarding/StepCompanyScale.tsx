import React from 'react'
import Input from '../../UI/Input'
import HeaderForVendor from './HeaderForVendor'


const StepCompanyScale = () => {
  return (
    <>
    
    <HeaderForVendor title_vendor="Company Scale" sub_title_vendor="All the fields are mandatory"/>
      {/* <div className="step_form_body align_form_center">  when you have the fields 4 uncomment this */}
      <div className="align_form_center">
      <div className="step_form_right">
        <div className="form_fields">
          <Input
            labelName="Employee Count"
            type="text"
            id="emp_count"
            name="emp_count"
            value=""
            onChange=""
          />
        </div>
           <div className="form_fields">
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
      </div>
    </>
  )
}

export default StepCompanyScale