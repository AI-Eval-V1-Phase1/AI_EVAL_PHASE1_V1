import Input from "../../../UI/Input";
import HeaderForVendor from "../../VendorOnboarding/HeaderForVendor";
import FormField from "../../../UI/FormField";

const StepCompetitiveAnalysis = ({ data }) => {
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
            <Input type="textarea" />
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
            <Input type="textarea" />
          </FormField>
        </div>
      </div>
    </>
  );
};

export default StepCompetitiveAnalysis;
