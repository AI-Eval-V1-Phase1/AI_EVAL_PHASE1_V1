import HeaderForBuyer from "../../BuyerOnboarding/HeaderForBuyer";
import { BUYER_COTS_FIELD_KEYS } from "../../../../constants/buyerCotsAssessmentKeys";
import BuyerCotsField from "./BuyerCotsField";
import FormField from "../../../UI/FormField";

const OTHER_SPECIFY_BELOW = "Other (Specify Below)";

function parseIntegrationSystemsValue(value: unknown): string[] {
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

const VendorEvaluation = ({
  data,
  formData,
  setFormData,
  readOnlyKeys = [],
  fieldErrors,
  title,
  subTitle,
  icon,
}) => {
  const keys = BUYER_COTS_FIELD_KEYS.vendorEvaluation;
  const isReadOnly = (key) => readOnlyKeys.includes(key);
  const integrationSystemsSelected = parseIntegrationSystemsValue(
    formData.integrationSystems,
  );
  const selectedOtherSpecifyBelow = integrationSystemsSelected.includes(
    OTHER_SPECIFY_BELOW,
  );

  return (
    <>
      <HeaderForBuyer
        className="header_for_vendor"
        title_vendor={title ?? "Vendor Evaluation"}
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
                readOnly={isReadOnly(key)}
                errorMessage={fieldErrors?.[key]}
              />
              {key === "integrationSystems" && (
                <div
                  className="form_fields_vendor buyer_cots_field integration_systems_other_wrapper"
                  style={{ marginTop: "0.75rem" }}
                  role="group"
                  aria-labelledby="integration-systems-other-label"
                >
                  <p
                    id="integration-systems-other-label"
                    className="integration_systems_other_context"
                    style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}
                  >
                    {selectedOtherSpecifyBelow
                      ? 'If you selected "Other (Specify Below)" above:'
                      : "Optional: specify other systems not listed above"}
                  </p>
                  <FormField
                    label="Please specify other systems"
                    tooltipText="Specify other systems to integrate with"
                  >
                    <input
                      type="text"
                      value={formData.integrationSystemsOther ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          integrationSystemsOther: e.target.value.slice(0, 300),
                        }))
                      }
                      maxLength={300}
                      placeholder="Enter other systems (max 300 characters)"
                      className="select_input"
                      style={{ width: "100%" }}
                      aria-label="Other integration systems details"
                      readOnly={isReadOnly(key)}
                    />
                  </FormField>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default VendorEvaluation;
