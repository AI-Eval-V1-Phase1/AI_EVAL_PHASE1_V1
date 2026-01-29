import { BUYER_ANNUAL_REVENUE, BUYER_EMPLOYEE_COUNTS } from "../../../config/buyerOnboardingData";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import YearPicker from "../../UI/YearPicker";
import HeaderForBuyer from "./HeaderForBuyer";

const BuyerOrganizationScale = () => {
  const title_vendor = "Organization Scale";

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />
      {/* <div className="step_form_body align_form_center"> */}
      <div>
        <div>
          <div className="form_fields_vendor">
            {/* <Input
              labelName="Organization Size*"
              type="text"
              id="orgSize"
              name="org_Size"
              value=""
              onChange=""
            /> */}
            <Select
              labelName={
                <>
                  Organization Size<span className="mandatory">*</span>
                </>
              }
              type="text"
              id="orgSize"
              name="org_Size"
              value=""
              default_option="Select organization size"
              options={BUYER_EMPLOYEE_COUNTS}
              onChange=""
              required
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  Annual Revenue Range
                </>
              }
              default_option="Select annual revenue change"
              type="text"
              id="annualRange"
              name="annual_Range"
              value=""
              options={BUYER_ANNUAL_REVENUE}
              
            />
          </div>
        </div>
        {/* <div "> */}
        <div className="form_fields_vendor">
          <YearPicker
            labelName={
              <>
                Year Founded
              </>
            }
            startYear={1800}
            label="Year Founded"
            
            value=""
            onChange=""
          
          />
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default BuyerOrganizationScale;
