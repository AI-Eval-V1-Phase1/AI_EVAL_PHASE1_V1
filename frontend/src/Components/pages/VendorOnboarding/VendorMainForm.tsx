import { useEffect, useState } from "react";
import "./vendor_onboarding.css";
import Button from "../../UI/Button";
import StepCompanyProfile from "./StepCompanyProfile";
import StepContactInformation from "./StepContactInformation";
import StepCompanyScale from "./StepCompanyScale";
import StepGeopgraphy from "./StepGeopgraphy";
import { ChevronLeftCircle, ChevronRightCircle, Send } from "lucide-react";
import StepVendorOnboardingPreview from "./StepVendorOnboardingPreview";
import { useNavigate } from "react-router-dom";
import CardOnBoarding from "../../UI/CardOnBoarding";
import CardContainerOnBoarding from "../../UI/CardContainerOnBoarding";
import CardConfirmation from "../../UI/CardConfirmation";

const VendorMainForm = () => {
  useEffect(() => {
    document.title = "AI Eval | Vendor Onboarding";
  }, []);

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [allStepsFilled, setAllStepsFilled] = useState(false);

  const handleContinue = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleBackToSelection = () => navigate("/onboarding");

  const handleSubmitPreview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAllStepsFilled(true); // mark form completed
  };

  return (
    <CardContainerOnBoarding>
      <form onSubmit={handleSubmitPreview}>
        <CardOnBoarding className="card_vendor">
          {/* Render current step */}
          {currentStep === 0 && <StepCompanyProfile />}
          {currentStep === 1 && <StepContactInformation />}
          {currentStep === 2 && <StepCompanyScale />}
          {currentStep === 3 && <StepGeopgraphy />}

          {/* Step 4: Preview or Confirmation */}
          {currentStep === 4 && !allStepsFilled && <StepVendorOnboardingPreview />}
          {currentStep === 4 && allStepsFilled && <CardConfirmation pageNavigateLink="Proceed to Vendor Attestation" />}
        </CardOnBoarding>

        {/* Navigation buttons */}
        <div className="vendor_action_btns">
          {/* Show back button only if confirmation is NOT shown */}
          {!allStepsFilled && (
            <div className="action_back">
              <Button
                type="button"
                onClick={currentStep === 0 ? handleBackToSelection : handleBack}
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
          {currentStep < 4 && (
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
          {currentStep === 4 && !allStepsFilled && (
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

export default VendorMainForm;
