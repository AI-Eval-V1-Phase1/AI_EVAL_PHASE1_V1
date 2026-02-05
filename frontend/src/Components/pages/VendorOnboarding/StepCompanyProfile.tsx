import type { ChangeEvent } from "react";
import Input from "../../UI/Input";
import HeaderForVendor from "./HeaderForVendor";
import Select from "../../UI/Select";
import DropdownTreeSelect from "../../UI/DropdownTreeSelect";
import {
  VENDOR_TYPES,
  VENDOR_MATURITY_LEVELS,
  INDUSTRY_SECTORS,
  VENDOR_HELPTEXT,
} from "../../../constants/vendorOnboardingData";
import type {
  StepPropsVendorData,
  VendorDataInterface,
} from "../../../types/formDataVendor";
import { Info } from "lucide-react";
import ClickTooltip from "../../UI/ClickTooltip";

const StepCompanyProfile = ({
  formVendorData,
  setFormVendorData,
}: StepPropsVendorData) => {
  // Generic handler for inputs/selects
  const handleChangeVendor = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
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
      newSectorData[sectorKey] = selectedValues.filter((val) =>
        allowedValues.includes(val),
      );
    });

    setFormVendorData({ ...formVendorData, sector: newSectorData });
  };

  // Flatten all selected sector values
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
          {/* Vendor Type */}
          <div className="form_fields_vendor">
            <Select
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Vendor Type</span>
                  <ClickTooltip content={VENDOR_HELPTEXT.vendorType}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
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

          {/* Industry Sector */}
          <div className="form_fields_vendor">
            <DropdownTreeSelect
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Industry Sector</span>
                  <ClickTooltip content={VENDOR_HELPTEXT.sector}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              id="industry_sec"
              default_option="Select industry sector"
              options={INDUSTRY_SECTORS}
              value={allSelectedSectors}
              required
              onChange={handleSectorChange}
            />
          </div>

          {/* Vendor Maturity Stage */}
          <div className="form_fields_vendor">
            <Select
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Vendor Maturity Stage</span>
                  <ClickTooltip content={VENDOR_HELPTEXT.vendorMaturity}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
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
          {/* Company Website */}
          <div className="form_fields_vendor">
            <Input
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Company Website</span>
                  <ClickTooltip content={VENDOR_HELPTEXT.companyWebsite}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              type="text"
              id="companyWebsite"
              name="companyWebsite"
              value={formVendorData.companyWebsite || ""}
              onChange={handleChangeVendor}
            />
          </div>

          {/* Company Description */}
          <div className="form_fields_vendor">
            <Input
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Company Description</span>
                  
                  <ClickTooltip content={VENDOR_HELPTEXT.companyDescription}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
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
