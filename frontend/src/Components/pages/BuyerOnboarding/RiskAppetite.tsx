import React from "react";
import HeaderForBuyer from "./HeaderForBuyer";
import Select from "../../UI/Select";
import ClickTooltip from "../../UI/ClickTooltip";
import { Info } from "lucide-react";
import {
  BUYER_ACCEPTABLE_RISK_LEVEL,
  BUYER_AI_RISK_APPETITE,
  BUYER_HELPTEXT,
} from "../../../constants/buyerOnboardingData";

const RiskAppetite = ({ formBuyerData, setFormBuyerData }) => {
  const title_vendor = "Risk Appetite";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormBuyerData({ ...formBuyerData, [name]: value });
  };
  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title_vendor}
      />

      <div>
        <div className="form_fields_vendor">
          <Select
            labelName={
              <div className="labelSection">
                <span className="mandatory">*</span>
                <span>AI Risk Appetite</span>
                <ClickTooltip content={BUYER_HELPTEXT.aiRiskAppetite}>
                  <Info size={14} color="#6B7280" />
                </ClickTooltip>
              </div>
            }
            id="aiRiskAppetite"
            name="aiRiskAppetite"
            default_option="Select AI risk appetite"
            options={BUYER_AI_RISK_APPETITE}
            value={formBuyerData.aiRiskAppetite || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form_fields_vendor">
          <Select
            labelName={
              <div className="labelSection">
                <span className="mandatory">*</span>
                <span>Acceptable Risk Level</span>
                <ClickTooltip content={BUYER_HELPTEXT.acceptableRiskLevel}>
                  <Info size={14} color="#6B7280" />
                </ClickTooltip>
              </div>
            }
            id="riskLevel"
            name="acceptableRiskLevel"
            default_option="Select acceptable risk level"
            options={BUYER_ACCEPTABLE_RISK_LEVEL}
            value={formBuyerData.acceptableRiskLevel || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </>
  );
};

export default RiskAppetite;
