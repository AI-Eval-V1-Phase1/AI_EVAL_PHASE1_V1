import HeaderForVendor from "./HeaderForVendor";
import Select from "../../UI/Select";
import MultiSelectDropDown from "../../UI/MultiSelectDropDown";
import Input from "../../UI/Input";
import { useState } from "react";
import {
  HEADQUARTERS_LOCATION,
  OPERATING_REGIONS,
} from "../../../config/vendorOnboardingData";

const StepGeography = () => {
  const [isVisibleInput, setIsVisibleInput] = useState(false);
  const [customHeadquarter, setCustomHeadquarter] = useState("");
  // const [operatingRegions, setOperatingRegions] = useState<string[]>([]);
  const [selectedHeadquarter, setSelectedHeadquarter] = useState(""); // dropdown

  const handleHeadquartersChange = (val: string) => {
      setSelectedHeadquarter(val); // always store dropdown selection
    if (val === "other") {
      setIsVisibleInput(true);
      setCustomHeadquarter("");
    } else {
      setIsVisibleInput(false);
      setCustomHeadquarter(val);
    }
  };

  return (
    <>
      <HeaderForVendor className="header_for_vendor" title_vendor="Geography" />
      <div>
        <div className="form_fields_vendor">
          <Select
            labelName="Headquarters Location"
            id="headquarters_loc"
            name="headquarters_loc"
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
              name="custom_headquarter"
              value={customHeadquarter}
              onChange={(e) => setCustomHeadquarter(e.target.value)}
            />
          </div>
        )}

        <div className="form_fields_vendor">
          <MultiSelectDropDown
            labelName="Operating Regions"
            id="operating_reg"
            options={OPERATING_REGIONS}
            default_option="Select operating regions"
            // value={operatingRegions}
            // onChange={setOperatingRegions}
          />
        </div>
      </div>
    </>
  );
};

export default StepGeography;
