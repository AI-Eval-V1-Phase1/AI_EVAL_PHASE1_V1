import { BUYER_COTS_FIELD_KEYS } from "../../../../constants/buyerCotsAssessmentKeys";
import BuyerCotsField from "./BuyerCotsField";
import HeaderForBuyer from "../../BuyerOnboarding/HeaderForBuyer";

const Evidence = ({
  data,
  formData,
  setFormData,
  fieldErrors,
  title,
  subTitle,
  icon,
}) => {
  const keys = BUYER_COTS_FIELD_KEYS.evidence;
  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title ?? "Evidence"}
        sub_title_vendor={subTitle}
        icon={icon}
      />
      <div>
        {keys.map((key, i) => {
          const config = data[i];
          return (
            <div key={key} className="form_fields_vendor buyer_cots_field">
              <BuyerCotsField
                fieldKey={key}
                label={config.label}
                placeholder={config.placeholder}
                required={config.required}
                options={config.options}
                multiselect={config.multiselect}
                value={formData[key]}
                onChange={(val) => setFormData((prev) => ({ ...prev, [key]: val }))}
                errorMessage={fieldErrors?.[key]}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Evidence;
