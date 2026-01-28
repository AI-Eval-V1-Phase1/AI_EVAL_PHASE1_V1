import React from "react";
import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";

const BuyerGeopgraphy = () => {
  const GEOGRAPHIC_REGIONS = [
    "North America",
    "Europe",
    "Asia-Pacific",
    "Latin America",
    "Middle East",
    "Africa",
  ].map((sector) => ({
    label: sector,
    value: sector,
  }));

const title_vendor= "Geography"

  return (
    <>
      <div className="step_form_header">
        {/* <h2>Geography</h2> */}
        {/* <p>All the fields are mandatory</p> */}
        <HeaderForBuyer title_vendor={title_vendor} />
      </div>
      <div className="step_form_body">
        <div className="step_form_right">
          <div className="form_fields">
            <Input
              labelName="Headquarters Location*"
              type="text"
              id="headquarters_loc"
              name="headquarters_loc"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields">
            {/* <Input
              labelName="Operating Regions*"
              type="operating_reg"
              id="operating_reg"
              name="operating_reg"
              value=""
              onChange=""
            /> */}
            <Select labelName="Operating Regions*"
              type="operating_reg"
              id="operating_reg"
              name="operating_reg"
              value=""
              default_option="Select"
              options={GEOGRAPHIC_REGIONS}
              onChange=""
                />
          </div>
        </div>
        <div className="step_form_left">
          <div className="form_fields">
            <Input
              labelName="Data Residency Requirements*"
              type="text"
              id="dataResidency"
              name="data_Residency"
              value=""
              onChange=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerGeopgraphy;
