import Input from "../../UI/Input";
import Select from "../../UI/Select";
import HeaderForBuyer from "./HeaderForBuyer";

const BuyerOrganizationScale = () => {
  const EMPLOYEE_COUNTS = [
    "1-10",
    "11-50",
    "51-200",
    "201-1000",
    "1001-5000",
    "5001-10000",
    "10000+",
  ].map((sector) => ({
    label: sector,
    value: sector,
  }));

  const title_vendor = "Company Scale"

  return (
    <>
      <div className="step_form_header">
        {/* <h2>Company Scale</h2> */}
        {/* <p>All the fields are mandatory</p> */}
        <HeaderForBuyer title_vendor={title_vendor} />
      </div>
      {/* <div className="step_form_body align_form_center"> */}
      <div className="step_form_body">
        <div className="step_form_right">
          <div className="form_fields">
            {/* <Input
              labelName="Organization Size*"
              type="text"
              id="orgSize"
              name="org_Size"
              value=""
              onChange=""
            /> */}
            <Select
              labelName="Organization Size*"
              type="text"
              id="orgSize"
              name="org_Size"
              value=""
              default_option="Select"
              options={EMPLOYEE_COUNTS}
              onChange=""
            />
          </div>
          <div className="form_fields">
            <Input
              labelName="Annual Revenue Range"
              type="text"
              id="annualRange"
              name="annual_Range"
              value=""
              onChange=""
            />
          </div>
        </div>
        <div className="step_form_left">
          <div className="form_fields">
            <Input
              labelName="Year Founded"
              type="year_founded"
              id="yearFounded"
              name="year_Founded"
              value=""
              onChange=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerOrganizationScale;
