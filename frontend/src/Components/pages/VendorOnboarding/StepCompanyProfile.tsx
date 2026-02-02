import type { ChangeEvent } from "react";
import Input from "../../UI/Input";
import HeaderForVendor from "./HeaderForVendor";
import Select from "../../UI/Select";
import DropdownTreeSelect from "../../UI/DropdownTreeSelect";
import { VENDOR_TYPES, VENDOR_MATURITY_LEVELS, INDUSTRY_SECTORS } from "../../../constants/vendorOnboardingData";
import type { StepPropsVendorData, VendorDataInterface } from "../../../types/formDataVendor";

const StepCompanyProfile = ({ formVendorData, setFormVendorData }: StepPropsVendorData) => {

  // Generic handler for inputs/selects
  const handleChangeVendor = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormVendorData({ ...formVendorData, [name]: value });
  };

  // Mapping from sector labels to keys in formVendorData.sector
  const SECTOR_KEY_MAP: Record<string, keyof VendorDataInterface["sector"]> = {
    "Public Sector": "public_sector",
    "Private Sector": "private_sector",
    "Non-Profit": "non_profit_sector",
  };

  // Handle selected sectors
  const handleSectorChange = (selectedValues: string[]) => {
    const newSectorData: VendorDataInterface["sector"] = {
      public_sector: [],
      private_sector: [],
      non_profit_sector: [],
    };

    INDUSTRY_SECTORS.forEach((sectorNode) => {
      const sectorKey = SECTOR_KEY_MAP[sectorNode.label];
      if (!sectorKey) return;

      const allowedValues = sectorNode.options.map((opt) => opt.value);
      newSectorData[sectorKey] = selectedValues.filter((val) => allowedValues.includes(val));
    });

    setFormVendorData({ ...formVendorData, sector: newSectorData });
  };

  // Flatten all selected sector values to pass as `value` to DropdownTreeSelect
  const allSelectedSectors = [
    ...(formVendorData.sector?.public_sector || []),
    ...(formVendorData.sector?.private_sector || []),
    ...(formVendorData.sector?.non_profit_sector || []),
  ];

  return (
    <>
      <HeaderForVendor
        className="header_for_vendor"
        title_vendor="Company Profile"
        sub_title_vendor="Tell us about your AI products and services"
      />

      <div className="step_form_body">
        <div className="step_form_right">
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  <span className="mandatory">*</span> Vendor Type
                </>
              }
              id="vendorType"
              name="vendorType"
              value={formVendorData.vendorType || ""}
              onChange={handleChangeVendor}
              default_option="Select vendor type"
              options={VENDOR_TYPES}
              required
            />
          </div>

          <div className="form_fields_vendor">
            <DropdownTreeSelect
              labelName={
                <>
                  <span className="mandatory">*</span> Industry Sector
                </>
              }
              id="industry_sec"
              default_option="Select industry sector"
              options={INDUSTRY_SECTORS}
              value={allSelectedSectors}
              required
              onChange={handleSectorChange}
            />
          </div>

          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  <span className="mandatory">*</span> Vendor Maturity Stage
                </>
              }
              id="vendorMaturity"
              name="vendorMaturity"
              value={formVendorData.vendorMaturity || ""}
              onChange={handleChangeVendor}
              required
              default_option="Select vendor maturity stage"
              options={VENDOR_MATURITY_LEVELS}
            />
          </div>
        </div>

        <div className="step_form_left">
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  <span className="mandatory">*</span> Company Website
                </>
              }
              type="text"
              id="companyWebsite"
              name="companyWebsite"
              value={formVendorData.companyWebsite || ""}
              onChange={handleChangeVendor}
            />
          </div>

          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  Company Description<span className="mandatory">*</span>
                </>
              }
              type="textarea"
              id="companyDescription"
              name="companyDescription"
              value={formVendorData.companyDescription || ""}
              onChange={handleChangeVendor}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StepCompanyProfile;
