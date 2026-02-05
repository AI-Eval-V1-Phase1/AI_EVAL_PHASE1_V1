import Input from "../../../UI/Input";
import HeaderForVendor from "../../VendorOnboarding/HeaderForVendor";
import FormField from "../../../UI/FormField";
import Select from "../../../UI/Select";
const StepCustomerDiscovery = ({ data }) => {
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
        <div className="form_fields_vendor">
          {/* Onboarding - Company Website Field */}
          <FormField
            label={data[3].label}
            mandatory={data[3].required}
            tooltipText={data[3].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Input type="text" />
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* Onboarding - Company Description Field */}
          <FormField
            label={data[4].label}
            mandatory={data[4].required}
            tooltipText={data[4].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Input type="textarea" />
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* Onboarding - Company Description Field */}
          <FormField
            label={data[5].label}
            mandatory={data[5].required}
            tooltipText={data[5].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Input type="textarea" />
          </FormField>
        </div>
      </div>
    </>
  );
};

export default StepCustomerDiscovery;
