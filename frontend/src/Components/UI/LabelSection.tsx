import { Info } from "lucide-react";
import ClickTooltip from "./ClickTooltip";

const LabelSection = ({ label, tooltipText, mandatory = false }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
      {mandatory && <span style={{ color: "red" }}>*</span>}
      <span>{label}</span>
      <ClickTooltip content={tooltipText}>
        <Info size={14} color="#6B7280" />
      </ClickTooltip>
    </div>
  );
};

export default LabelSection;
