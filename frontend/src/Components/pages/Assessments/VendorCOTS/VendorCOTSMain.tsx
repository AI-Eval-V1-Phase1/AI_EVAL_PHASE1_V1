import { useEffect, useState } from "react";
import CardContainerOnBoarding from "../../../UI/CardContainerOnBoarding";
import CardOnBoarding from "../../../UI/CardOnBoarding";
import StepCompetitiveAnalysis from "./StepCompetitiveAnalysis";
import StepCustomerDiscovery from "./StepCustomerDiscovery";
import StepCustomerRiskContext from "./StepCustomerRiskContext";
import StepSolutionFit from "./StepSolutionFit";
import Button from "../../../UI/Button";
import { ChevronLeftCircle } from "lucide-react";
import { ChevronRightCircle } from "lucide-react";
import { Send } from "lucide-react";
import { VENDOR_COTS_DATA } from "../../../../constants/vendorCotsData";
import StepCustomerRiskMitigation from "./StepCustomerRiskMitigation";

const VendorCOTSMain = () => {
  useEffect(() => {
    document.title = "AI Eval | Vendor COTS";
  });
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [allStepsFilled, setAllStepsFilled] = useState<boolean>(false);

  const handleContinue = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);
  return (
    <CardContainerOnBoarding>
      <form>
        <CardOnBoarding className="card_vendor">
          {/* Render current step */}
          {currentStep === 0 && <StepCustomerDiscovery data={VENDOR_COTS_DATA.customer_discovery}/>}
          {currentStep === 1 && <StepSolutionFit data={VENDOR_COTS_DATA.solution_fit} />}
          {currentStep === 2 && <StepCustomerRiskContext data={VENDOR_COTS_DATA.customer_risk_context}/>}
          {currentStep === 3 && <StepCompetitiveAnalysis data={VENDOR_COTS_DATA.competitive_analysis}/>}
          {currentStep === 4 && <StepCustomerRiskMitigation data={VENDOR_COTS_DATA.competitive_analysis}/>}

          {/* Step 4: Preview or Confirmation */}
          {/* {currentStep === 4 && !allStepsFilled && (
            <StepVendorOnboardingPreview  />
          )}
          {currentStep === 4 && allStepsFilled && (
            <CardConfirmation pageNavigateLink="Proceed to Vendor Attestation" />
          )} */}
        </CardOnBoarding>

        {/* Navigation buttons */}
        <div className="vendor_action_btns">
          {/* Show back button only if confirmation is NOT shown */}
          {!allStepsFilled && (
            <div className="action_back">
              <Button
                type="button"
                onClick={currentStep > 0 ? handleBack : undefined}
                disabled={currentStep === 0}
                className="back_btn"
              >
                <span>
                  <ChevronLeftCircle size={16} />
                  Back
                </span>
              </Button>
            </div>
          )}

          {/* Continue button for steps 0-3 */}
          {currentStep < 5 && (
            <div className="action_continue_btn">
              <Button
                onClick={handleContinue}
                type="button"
                className="continue_btn"
              >
                <span>
                  Continue <ChevronRightCircle size={16} />
                </span>
              </Button>
            </div>
          )}

          {/* Submit button for preview step */}
          {currentStep === 5 && !allStepsFilled && (
            <div className="action_submit_btn">
              <Button type="submit" className="submit_btn_vendor">
                <span>
                  Submit <Send size={16} />
                </span>
              </Button>
            </div>
          )}
        </div>
      </form>
    </CardContainerOnBoarding>
  );
};

export default VendorCOTSMain;
