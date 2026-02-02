import Input from "../../UI/Input";
import Select from "../../UI/Select";
import HeaderForBuyer from "./HeaderForBuyer";
import DropdownTreeSelect from "../../UI/DropdownTreeSelect";
import ClickTooltip from "../../UI/ClickTooltip";
import { Info } from "lucide-react";
import {
  BUYER_ORGANIZATION_TYPE,
  BUYER_INDUSTRY_SECTORS,
  BUYER_HELPTEXT,
} from "../../../constants/buyerOnboardingData";
import type {
  BuyerDataInterface,
  StepPropsBuyerrData,
} from "../../../types/formDataBuyer";

const BuyerOrganizationProfile = ({
  formBuyerData,
  setFormBuyerData,
}: StepPropsBuyerrData) => {
  const handleChangeBuyer = (e) => {
    const { name, value } = e.target;
    setFormBuyerData({ ...formBuyerData, [name]: value });
  };

  // const title_vendor = "Organization Profile"

  // 2. Update SECTOR_KEY_MAP
  const SECTOR_KEY_MAP: Record<string, keyof BuyerDataInterface["sector"]> = {
    "Public Sector": "public_sector",
    "Private Sector": "private_sector",
    "Non-Profit": "non_profit_sector",
  };

  // console.log(SECTOR_KEY_MAP);
  // 3. Update handleSectorChange
  // Handle selected sectors
  const handleSectorChange = (selectedValues: string[]) => {
    const newSectorData: BuyerDataInterface["sector"] = {
      public_sector: [],
      private_sector: [],
      non_profit_sector: [],
    };

    BUYER_INDUSTRY_SECTORS.forEach((sectorNode) => {
      const sectorKey = SECTOR_KEY_MAP[sectorNode.label];
      if (!sectorKey) return;

      const allowedValues = sectorNode.options.map((opt) => opt.value);
      newSectorData[sectorKey] = selectedValues.filter((val) =>
        allowedValues.includes(val),
      );
    });

    setFormBuyerData({ ...formBuyerData, sector: newSectorData });
  };

  // Flatten all selected sector values
  const allSelectedSectors = [
    ...(formBuyerData.sector?.public_sector || []),
    ...(formBuyerData.sector?.private_sector || []),
    ...(formBuyerData.sector?.non_profit_sector || []),
  ];

  // console.log(allSelectedSectors);

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor="Organization Profile"
        sub_title_vendor="This information helps us tailor assessments to your context"
      />
      <div>
        <div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                  <div className="labelSection">
                    <span className="mandatory">*</span>
                    <span>Organization Name</span>
                    <ClickTooltip content={BUYER_HELPTEXT.organizationName}>
                      <Info size={14} color="#6B7280" />
                    </ClickTooltip>
                  </div>{" "}
                </>
              }
              type="text"
              id="organizationName"
              name="organizationName"
              value={formBuyerData.organizationName || ""}
              onChange={handleChangeBuyer}
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Organization Type</span>
                  <ClickTooltip content={BUYER_HELPTEXT.organizationType}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              id="organizationType"
              name="organizationType"
              value={formBuyerData.organizationType || ""}
              onChange={handleChangeBuyer}
              default_option="Select"
              options={BUYER_ORGANIZATION_TYPE}
            />
          </div>
        </div>
        <div>
          <div className="form_fields_vendor">
            <DropdownTreeSelect
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Industry Sector</span>
                  <ClickTooltip content={BUYER_HELPTEXT.sector}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              id="industry_sec"
              default_option="Select industry sector"
              options={BUYER_INDUSTRY_SECTORS}
              value={allSelectedSectors}
              required
              onChange={handleSectorChange}
            />
          </div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Organization Website</span>
                  <ClickTooltip content={BUYER_HELPTEXT.organizationWebsite}>
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              type="text"
              id="organizationWebsite"
              name="organizationWebsite"
              value={formBuyerData.organizationWebsite || ""}
              onChange={handleChangeBuyer}
            />
          </div>

          <div className="form_fields_vendor">
            <Input
              labelName={
                <div className="labelSection">
                  <span className="mandatory">*</span>
                  <span>Organization Description</span>
                  <ClickTooltip
                    content={BUYER_HELPTEXT.organizationDescription}
                  >
                    <Info size={14} color="#6B7280" />
                  </ClickTooltip>
                </div>
              }
              type="textarea"
              id="organizationDescription"
              name="organizationDescription"
              value={formBuyerData.organizationDescription || ""}
              onChange={handleChangeBuyer}
            />
          </div>
        </div>
        {/* <div className="step_form_right">
            <div className="form_fields_vendor">
              <Input
                labelName="Organization Description"
                type="text"
                id="orgDescription"
                name="org_Description"
                value=""
                onChange=""
              />
            </div>
          </div> */}
      </div>
    </>
  );
};

export default BuyerOrganizationProfile;
