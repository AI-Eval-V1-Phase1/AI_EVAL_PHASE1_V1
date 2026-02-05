import Input from "../../../UI/Input";
import HeaderForVendor from "../../VendorOnboarding/HeaderForVendor";
import FormField from "../../../UI/FormField";
import Select from "../../../UI/Select";

const StepCustomerRiskMitigation = ({data}) => {
  const dummy_data = ["hello"]
  return (
    <>
      <HeaderForVendor
        title_vendor="Customer Discovery"
        className="header_for_vendor"
      />

      <div>
        <div className="form_fields_vendor">
          {/* VendorType */}
          <FormField
            label={data[0].label}
            mandatory={data[0].required}
            tooltipText={data[0].placeholder}
            // errorText={errors.companyWebsite}
          >
           <Input type="text"/>
          </FormField>
        </div>

      </div>
    </>
  );
}

export default StepCustomerRiskMitigation