import type { ChangeEvent } from "react";
import HeaderForVendor from "../VendorOnboarding/HeaderForVendor";
import FormField from "../../UI/FormField";
import Select from "../../UI/Select";
import Input from "../../UI/Input";
import DropdownTreeSelect from "../../UI/DropdownTreeSelect";
import MultiSelectDropDown from "../../UI/MultiSelectDropDown";
import YearPicker from "../../UI/YearPicker";
import {
  VENDOR_TYPES,
  VENDOR_MATURITY_LEVELS,
  INDUSTRY_SECTORS,
  EMPLOYEE_COUNTS,
  HEADQUARTERS_LOCATION,
  OPERATING_REGIONS,
  VENDOR_HELPTEXT,
} from "../../../constants/vendorOnboardingData";
import type { AttestationCompanyProfile } from "../../../types/vendorSelfAttestation";
import { Info } from "lucide-react";
import ClickTooltip from "../../UI/ClickTooltip";

const SECTOR_KEY_MAP: Record<string, keyof Record<string, string[]>> = {
  "Public Sector": "public_sector",
  "Private Sector": "private_sector",
  "Non-Profit": "non_profit_sector",
};

export interface StepCompanyProfileAttestationProps {
  companyProfile: AttestationCompanyProfile;
  setCompanyProfile: React.Dispatch<React.SetStateAction<AttestationCompanyProfile>>;
}

const StepCompanyProfileAttestation = ({
  companyProfile,
  setCompanyProfile,
}: StepCompanyProfileAttestationProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyProfile((prev) => ({ ...prev, [name]: value }));
  };

  const sector = (companyProfile.sector ?? {}) as Record<string, string[]>;
  const handleSectorChange = (selectedValues: string[]) => {
    const newSector: Record<string, string[]> = {
      public_sector: [],
      private_sector: [],
      non_profit_sector: [],
    };
    INDUSTRY_SECTORS.forEach((sectorNode) => {
      const key = SECTOR_KEY_MAP[sectorNode.label];
      if (!key) return;
      const allowed = sectorNode.options.map((o) => o.value);
      newSector[key] = selectedValues.filter((v) => allowed.includes(v));
    });
    setCompanyProfile((prev) => ({ ...prev, sector: newSector }));
  };

  const allSelectedSectors = [
    ...(sector.public_sector || []),
    ...(sector.private_sector || []),
    ...(sector.non_profit_sector || []),
  ];

  const currentYear = new Date().getFullYear();

  return (
    <>
      <HeaderForVendor title_vendor="Company Profile" className="header_for_vendor" />

      <div className="step_form_body">
        <div className="step_form_right">
          <div className="form_fields_vendor">
            <FormField
              label="What type of vendor are you?"
              mandatory={true}
              tooltipText={VENDOR_HELPTEXT.vendorType}
            >
              <Select
                labelName=""
                id="vendorType"
                name="vendorType"
                value={companyProfile.vendorType || ""}
                onChange={handleChange}
                default_option="Select vendor type"
                options={VENDOR_TYPES}
                required
              />
            </FormField>
          </div>
          <div className="form_fields_vendor">
            <FormField
              label="What is your Target Industries"
              mandatory={true}
              tooltipText={VENDOR_HELPTEXT.sector}
            >
              <DropdownTreeSelect
                id="industry_sec"
                default_option="Select industry sector"
                options={INDUSTRY_SECTORS}
                value={allSelectedSectors}
                required
                onChange={handleSectorChange}
              />
            </FormField>
          </div>
          <div className="form_fields_vendor">
            <FormField
              label="What stage is your company at?"
              mandatory={true}
              tooltipText={VENDOR_HELPTEXT.vendorMaturity}
            >
              <Select
                labelName=""
                id="vendorMaturity"
                name="vendorMaturity"
                value={companyProfile.vendorMaturity || ""}
                onChange={handleChange}
                default_option="Select vendor maturity stage"
                options={VENDOR_MATURITY_LEVELS}
                required
              />
            </FormField>
          </div>
        </div>

        <div className="step_form_left">
          <div className="form_fields_vendor">
            <FormField
              label="Company Website"
              mandatory={true}
              tooltipText={VENDOR_HELPTEXT.companyWebsite}
            >
              <Input
                labelName=""
                type="text"
                id="companyWebsite"
                name="companyWebsite"
                value={companyProfile.companyWebsite || ""}
                onChange={handleChange}
              />
            </FormField>
          </div>
          <div className="form_fields_vendor">
            <FormField
              label="Brief Company Description"
              mandatory={true}
              tooltipText={VENDOR_HELPTEXT.companyDescription}
            >
              <Input
                labelName=""
                type="textarea"
                id="companyDescription"
                name="companyDescription"
                value={companyProfile.companyDescription || ""}
                onChange={handleChange}
              />
            </FormField>
          </div>
          <div className="form_fields_vendor">
            <FormField
              label="Approximate Number of Employees"
              mandatory={true}
              tooltipText="Select the range that includes your total headcount"
            >
              <Select
                labelName=""
                id="employeeCount"
                name="employeeCount"
                value={companyProfile.employeeCount || ""}
                onChange={handleChange}
                default_option="Select employee count"
                options={EMPLOYEE_COUNTS}
                required
              />
            </FormField>
          </div>
          <div className="form_fields_vendor">
            <FormField
              label="Year Company Founded"
              mandatory={true}
              tooltipText="Enter 4-digit year (e.g., 2018)"
            >
              <YearPicker
                startYear={1950}
                endYear={currentYear}
                id="yearFounded"
                name="yearFounded"
                value={companyProfile.yearFounded ?? ""}
                onChange={(e) => {
                  const v = e.target.value ? Number(e.target.value) : "";
                  setCompanyProfile((prev) => ({ ...prev, yearFounded: v }));
                }}
              />
            </FormField>
          </div>
          <div className="form_fields_vendor">
            <FormField
              label="Headquarters Location"
              mandatory={true}
              tooltipText={VENDOR_HELPTEXT.headquartersLocation}
            >
              <Select
                labelName=""
                id="headquartersLocation"
                name="headquartersLocation"
                value={companyProfile.headquartersLocation || ""}
                onChange={handleChange}
                default_option="Select headquarter location"
                options={HEADQUARTERS_LOCATION}
                required
              />
            </FormField>
          </div>
          <div className="form_fields_vendor">
            <FormField
              label="Geographic Regions Where You Operate"
              mandatory={true}
              tooltipText={VENDOR_HELPTEXT.operatingRegions}
            >
              <MultiSelectDropDown
                id="operatingRegions"
                options={OPERATING_REGIONS}
                default_option="Select operating regions"
                value={companyProfile.operatingRegions || []}
                onChange={(selected: string[]) =>
                  setCompanyProfile((prev) => ({ ...prev, operatingRegions: selected }))
                }
              />
            </FormField>
          </div>
        </div>
      </div>
    </>
  );
};

export default StepCompanyProfileAttestation;
