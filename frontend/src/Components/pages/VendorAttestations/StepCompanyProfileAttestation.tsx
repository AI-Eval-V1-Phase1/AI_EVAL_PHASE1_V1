import React from "react";
import HeaderForVendor from "../VendorOnboarding/HeaderForVendor";
import FormField from "../../UI/FormField";
import Select from "../../UI/Select";
import Input from "../../UI/Input";


// import DropdownTreeSelect from "../../UI/DropdownTreeSelect";
import {
  INDUSTRY_SECTORS,
  VENDOR_TYPES,
} from "../../../constants/vendorOnboardingData";

const StepCompanyProfileAttestation = ({data}) => {
  const COMPANY_PROFILE = data;
  const dummy_data = ["Vendor Type"];

  // Mapping from sector labels to keys in formVendorData.sector
  // const SECTOR_KEY_MAP: Record<string, keyof VendorDataInterface["sector"]> = {
  //   "Public Sector": "public_sector",
  //   "Private Sector": "private_sector",
  //   "Non-Profit": "non_profit_sector",
  // };

  // // Handle selected sectors
  // const handleSectorChange = (selectedValues: string[]) => {
  //   const newSectorData: VendorDataInterface["sector"] = {
  //     public_sector: [],
  //     private_sector: [],
  //     non_profit_sector: [],
  //   };

  //   INDUSTRY_SECTORS.forEach((sectorNode) => {
  //     const sectorKey = SECTOR_KEY_MAP[sectorNode.label];
  //     if (!sectorKey) return;

  //     const allowedValues = sectorNode.options.map((opt) => opt.value);
  //     newSectorData[sectorKey] = selectedValues.filter((val) =>
  //       allowedValues.includes(val),
  //     );
  //   });

  //   setFormVendorData({ ...formVendorData, sector: newSectorData });
  // };

  // // Flatten all selected sector values
  // const allSelectedSectors = [
  //   ...(formVendorData.sector?.public_sector || []),
  //   ...(formVendorData.sector?.private_sector || []),
  //   ...(formVendorData.sector?.non_profit_sector || []),
  // ];

  return (
    <>
      <HeaderForVendor
        title_vendor="Company Profile"
        className="header_for_vendor"
      />

      <div>
        <div className="form_fields_vendor">
          {/* VendorType */}
          <FormField
            label={COMPANY_PROFILE[0].label}
            mandatory={COMPANY_PROFILE[0].required}
            tooltipText={COMPANY_PROFILE[0].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Select
              // id="companyWebsite"
              // name="companyWebsite"
              // type="tex"
              default_option="Select"
              options={VENDOR_TYPES}
              // value={""}
              // onChange={handleChangeVendor}
            />
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* Onboarding - Indsutry Selector */}
          <FormField
            label={COMPANY_PROFILE[1].label}
            mandatory={COMPANY_PROFILE[1].required}
            tooltipText={COMPANY_PROFILE[1].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Select
              // id="companyWebsite"
              // name="companyWebsite"
              // type="tex"
              default_option="Select"
              options={VENDOR_TYPES}
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
            label={COMPANY_PROFILE[2].label}
            mandatory={COMPANY_PROFILE[2].required}
            tooltipText={COMPANY_PROFILE[2].placeholder}
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
            label={COMPANY_PROFILE[3].label}
            mandatory={COMPANY_PROFILE[3].required}
            tooltipText={COMPANY_PROFILE[3].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Input type="text" />
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* Onboarding - Company Description Field */}
          <FormField
            label={COMPANY_PROFILE[4].label}
            mandatory={COMPANY_PROFILE[4].required}
            tooltipText={COMPANY_PROFILE[4].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Input type="textarea" />
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* Onboarding - Year Founded Field */}
          <FormField
            label={COMPANY_PROFILE[5].label}
            mandatory={COMPANY_PROFILE[5].required}
            tooltipText={COMPANY_PROFILE[5].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Select
              // id="companyWebsite"
              // name="companyWebsite"
              // type="tex"
              default_option="Select Year Founded"
              options={dummy_data}
              // value={""}
              // onChange={handleChangeVendor}
            />
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* Onboarding - Headquarters Location Field */}
          <FormField
            label={COMPANY_PROFILE[6].label}
            mandatory={COMPANY_PROFILE[6].required}
            tooltipText={COMPANY_PROFILE[6].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Select
              // id="companyWebsite"
              // name="companyWebsite"
              // type="tex"
              default_option="Select Vendor Type"
              options={dummy_data}
              // value={""}
              // onChange={handleChangeVendor}
            />
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* VendorType */}
          <FormField
            label={COMPANY_PROFILE[7].label}
            mandatory={COMPANY_PROFILE[7].required}
            tooltipText={COMPANY_PROFILE[7].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Select
              // id="companyWebsite"
              // name="companyWebsite"
              // type="tex"
              default_option="Select Vendor Type"
              options={dummy_data}
              // value={""}
              // onChange={handleChangeVendor}
            />
          </FormField>
        </div>
        <div className="form_fields_vendor">
          {/* VendorType */}
          <FormField
            label={COMPANY_PROFILE[8].label}
            mandatory={COMPANY_PROFILE[8].required}
            tooltipText={COMPANY_PROFILE[8].placeholder}
            // errorText={errors.companyWebsite}
          >
            <Select
              // id="companyWebsite"
              // name="companyWebsite"
              // type="tex"
              default_option="Select Vendor Type"
              options={dummy_data}
              // value={""}
              // onChange={handleChangeVendor}
            />
          </FormField>
        </div>
      </div>
    </>
  );
};

export default StepCompanyProfileAttestation;
