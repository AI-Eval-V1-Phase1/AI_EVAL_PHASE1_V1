import Input from "../../UI/Input";

const StepCustomerDiscovery = () => {
  return (
    <>
      <div className="step_form_header">
        <h2>Customer Discovery</h2>
        <p>All the fields are mandatory</p>
      </div>
      <div className="step_form_body">
      <div className="step_form_right">
        <div className="form_fields">
          <Input
            labelName="Customer Organization Name"
            type="text"
            id="customer_org_name"
            name="customer_org_name"
            value=""
            // onChange=""
          />
        </div>
        <div className="form_fields">
          <Input
            labelName="Customer Industry Sector"
            type="text"
            id="customer_industry"
            name="customer_industry"
            value=""
            // onChange=""
          />
        </div>
        <div className="form_fields">
          <Input
            labelName="Customer Pain Point"
            type="text"
            id="customer_pain_point"
            name="customer_pain_point"
            value=""
            // onChange=""
          />
        </div>
      </div>
      <div className="step_form_left">
        <div className="form_fields">
          <Input
            labelName="Customer Expected Outcomes"
            type="text"
            id="customer_org_name"
            name="customer_org_name"
            value=""
            // onChange=""
          />
        </div>
        <div className="form_fields">
          {" "}
          <Input
            labelName="Customer Budget Range"
            type="text"
            id="customer_org_name"
            name="customer_org_name"
            value=""
            // onChange=""
          />
        </div>
        <div className="form_fields">
          {" "}
          <Input
            labelName="Customer Timeline"
            type="text"
            id="customer_org_name"
            name="customer_org_name"
            value=""
            // onChange=""
          />
        </div>
        </div>
      </div>
    </>
  );
};

export default StepCustomerDiscovery;
