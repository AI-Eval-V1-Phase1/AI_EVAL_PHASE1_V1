import HeaderForVendor from "./HeaderForVendor";
import Select from "../../UI/Select";
import MultiSelectDropDown from "../../UI/MultiSelectDropDown";
import Input from "../../UI/Input";
import { useState } from "react";
import {
  HEADQUARTERS_LOCATION,
  OPERATING_REGIONS,
} from "../../../constants/vendorOnboardingData";
import type {  StepPropsVendorData } from "../../../types/formDataVendor";

const StepGeography = ({ formVendorData, setFormVendorData }: StepPropsVendorData) => {
  const [isVisibleInput, setIsVisibleInput] = useState(false);
  const [customHeadquarter, setCustomHeadquarter] = useState("");
  const [selectedHeadquarter, setSelectedHeadquarter] = useState(""); 

  const handleHeadquartersChange = (val: string) => {
    setSelectedHeadquarter(val);
    if (val === "other") {
      setIsVisibleInput(true);
      setCustomHeadquarter("");
      setFormVendorData({ ...formVendorData, headquartersLocation: "" });
    } else {
      setIsVisibleInput(false);
      setCustomHeadquarter(val);
      setFormVendorData({ ...formVendorData, headquartersLocation: val });
    }
  };

  return (
    <>
      <HeaderForVendor className="header_for_vendor" title_vendor="Geography" />

      <div className="form_fields_vendor">
        <Select
          labelName="Headquarters Location"
          id="headquartersLocation"
          name="headquartersLocation"
          options={HEADQUARTERS_LOCATION}
          value={selectedHeadquarter}
          default_option="Select headquarter location"
          onChange={(e) => handleHeadquartersChange(e.target.value)}
        />
      </div>

      {isVisibleInput && (
        <div className="form_fields_vendor">
          <Input
            labelName="Specify Location"
            id="custom_headquarter"
            name="headquartersLocation"
            value={customHeadquarter}
            onChange={(e) => {
              setCustomHeadquarter(e.target.value);
              setFormVendorData({
                ...formVendorData,
                headquartersLocation: e.target.value,
              });
            }}
          />
        </div>
      )}

      <div className="form_fields_vendor">
        <MultiSelectDropDown
          labelName="Operating Regions"
          id="operatingRegions"
          options={OPERATING_REGIONS}
          default_option="Select operating regions"
          value={formVendorData.operatingRegions}
          onChange={(selected: string[]) =>
            setFormVendorData({ ...formVendorData, operatingRegions: selected })
          }
        />
      </div>
    </>
  );
};

export default StepGeography;
