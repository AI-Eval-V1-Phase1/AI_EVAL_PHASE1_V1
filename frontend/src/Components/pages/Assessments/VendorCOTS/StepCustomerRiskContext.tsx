import Input from "../../../UI/Input";
import HeaderForVendor from "../../VendorOnboarding/HeaderForVendor";
import FormField from "../../../UI/FormField";
import Select from "../../../UI/Select";


const StepCustomerRiskContext = ({data}) => {
  const dummy_data = ["hello"];
  return (
    <>
      <HeaderForVendor
        title_vendor="Customer Risk Context"
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
            <Input type="text" />
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* Onboarding - Indsutry Selector */}
          <FormField
            label={data[1].label}
            mandatory={data[1].required}
            tooltipText={data[1].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Select
              // id="companyWebsite"
              // name="companyWebsite"
              // type="tex"
              default_option="Select"
              options={dummy_data}
              // value={""}
              // onChange={handleChangeVendor}
            />
            {/* <DropdownTreeSelect
              id="industry_sec"
              default_option="Select industry sector"
              options={INDUSTRY_SECTORS}
              // value={allSelectedSectors}
              required
              // onChange={handleSectorChange}
            /> */}
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* Onboarding - Vendor Maturity Stage Field */}
          <FormField
            label={data[2].label}
            mandatory={data[2].required}
            tooltipText={data[2].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Select
              // id="companyWebsite"
              // name="companyWebsite"
              // type="tex"
              default_option="Select Vendor Maturity"
              options={dummy_data}
              // value={""}
              // onChange={handleChangeVendor}
            />
          </FormField>
        </div>
        
        
      </div>
    </>
  );
}

export default StepCustomerRiskContext