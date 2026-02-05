import { Info } from "lucide-react";
import ClickTooltip from "./ClickTooltip";
import ErrorText from "./ErrorText";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  mandatory?: boolean;
  tooltipText?: string;
  errorText?: string;
  children: ReactNode; // The actual input/select/dropdown component
}

const FormField = ({
  label,
  mandatory = false,
  tooltipText,
  errorText,
  children,
}: FormFieldProps) => {
  return (
    <>
      <div className="labelSection" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
        {mandatory && <span style={{ color: "red" }}>*</span>}
        <span>{label}</span>
        {tooltipText && (
          <ClickTooltip content={tooltipText}>
            <Info size={14} color="#6B7280" />
          </ClickTooltip>
        )}
      </div>
      {children}
      {errorText && <ErrorText error_text={errorText} />}
     </>
  );
};

export default FormField;
