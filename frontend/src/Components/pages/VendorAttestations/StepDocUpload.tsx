import HeaderForVendor from "../VendorOnboarding/HeaderForVendor";
import FormField from "../../UI/FormField";
import Select from "../../UI/Select";
import Input from "../../UI/Input";
import FileUpload from "../../UI/FileUpload";

const StepDocUpload = ({ data }) => {
  return (
    <>
      <HeaderForVendor
        title_vendor="Document Upload"
        className="header_for_vendor"
      />

      <div>
        <div className="form_fields_vendor">
          {/* File Upload (Multi) */}
          <FormField
            label={data[0].label}
            mandatory={data[0].required}
            tooltipText={data[0].placeholder}
            // errorText={errors.companyWebsite}
          >
            <FileUpload multiple accept=".pdf,.doc,.ppt"/>
          </FormField>
        </div>

        <div className="form_fields_vendor">
          {/* File Upload (Multi) */}
          <FormField
            label={data[1].label}
            mandatory={data[1].required}
            tooltipText={data[1].placeholder}
            // errorText={errors.companyWebsite}
          >
            <FileUpload multiple accept=".pdf,.doc,.ppt"/>
          </FormField>
        </div>

        <div className="form_fields_vendor">
          {/* File Upload (Multi) */}
          <FormField
            label={data[2].label}
            mandatory={data[2].required}
            tooltipText={data[2].placeholder}
            // errorText={errors.companyWebsite}
          >
            <FileUpload multiple accept=".pdf,.doc,.ppt"/>
          </FormField>
        </div>
      </div>
    </>
  );
};

export default StepDocUpload;
