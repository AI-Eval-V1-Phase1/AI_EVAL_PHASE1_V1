import FormField from "../../../UI/FormField";
// import Input from "../../UI/Input";
import HeaderForVendor from "../../VendorOnboarding/HeaderForVendor";

const OrganizationProfile = ({ data }) => {
  return (
    <>
      <HeaderForVendor
        className="header_for_vendor"
        title_vendor="Organization Profile "
        // sub_title_vendor="Tell us about your AI products and services"
      />
      <div>
        <div className="form_fields_vendor">
          <FormField
            label={data[0].label}
            mandatory={data[0].required}
            tooltipText={data[0].placeholder}
          >
            <input type="text" />
          </FormField>
          <FormField
            label={data[1].label}
            mandatory={data[1].required}
            tooltipText={data[1].placeholder}
          >
            <input type="text" />
          </FormField>
          <FormField
            label={data[2].label}
            mandatory={data[2].required}
            tooltipText={data[2].placeholder}
          >
           <input type="text" />
          </FormField>
          <FormField
            label={data[3].label}
            mandatory={data[3].required}
            tooltipText={data[3].placeholder}
          >
          <input type="text" />
          </FormField>
        </div>
      </div>
    </>
  );
};

export default OrganizationProfile;
