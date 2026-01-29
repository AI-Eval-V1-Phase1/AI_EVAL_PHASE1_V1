import Input from "../../UI/Input";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";
import { useState } from "react";
import { BUYER_DATA_RESIDENCY_REQUIREMENTS, BUYER_HEADQUARTERS_LOCATION, BUYER_OPERATING_REGIONS } from "../../../config/buyerOnboardingData";
import MultiSelectDropDown from "../../UI/MultiSelectDropDown";

const BuyerGeopgraphy = () => {
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

  const title_vendor = "Geography";

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />
      <div >
        <div className="form_fields_vendor">
        <Select

          labelName={
                <>
                 Headquarters Location<span className="mandatory">*</span>
                </>
              }
            id="headquarters_loc"
            required
            name="headquarters_loc"
            options={BUYER_HEADQUARTERS_LOCATION}
            value={selectedHeadquarter}
            default_option="Select headquarter location"
            onChange={(e) => handleHeadquartersChange(e.target.value)}
          />
        </div>

        {isVisibleInput && (
          <div className="form_fields_vendor">
            <Input
             labelName={
                <>
                Specify Location<span className="mandatory">*</span>
                </>
              }
              id="custom_headquarter"
              name="custom_headquarter"
              value={customHeadquarter}
              onChange={(e) => setCustomHeadquarter(e.target.value)}
            />
          </div>
        )}
          <div className="form_fields_vendor">
            {/* <Input
              labelName="Operating Regions*"
              type="operating_reg"
              id="operating_reg"
              name="operating_reg"
              value=""
              onChange=""
            /> */}
            <MultiSelectDropDown
               labelName={
                <>
                Operating Regions<span className="mandatory">*</span>
                </>
              }
              required
              
              id="operating_reg"
              name="operating_reg"
              value=""
              default_option="Select"
              options={BUYER_OPERATING_REGIONS}
              onChange=""
            />
          </div>
        </div>
        <div>
          <div className="form_fields_vendor">
            <MultiSelectDropDown

              labelName={
                <>
               Data Residency Requirements<span className="mandatory">*</span>
                </>
              }
              default_option="Select data residency"
              id="dataResidency"
              name="data_Residency"
              value=""
              onChange=""
              options={BUYER_DATA_RESIDENCY_REQUIREMENTS}
            />
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default BuyerGeopgraphy;
