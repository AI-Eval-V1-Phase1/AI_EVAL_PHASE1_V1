import CardContainerOnBoarding from "../../../UI/CardContainerOnBoarding";
import CardOnBoarding from "../../../UI/CardOnBoarding";
import OrganizationProfile from "./OrganizationProfile";
import { BUYER_COTS_ASSESSMENT } from "../../../../constants/buyerCOTSData";
import { useState } from "react";
import Button from "../../../UI/Button";
import { ChevronLeftCircle } from "lucide-react";
import { ChevronRightCircle } from "lucide-react";
import { Send } from "lucide-react";
import CardConfirmation from "../../../UI/CardConfirmation";
import UseCase from "./UseCase";
import VendorEvaluation from "./VendorEvaluation";
import Readiness from "./Readiness";
import RiskProfile from "./RiskProfile";
import VendoeRisk from "./VendorRisk";
import Implementation from "./Implementation";

// import StepProductProfile from "./StepProductProfile";
const BuyerAssessment = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [allStepsFilled, setAllStepsFilled] = useState<boolean>(false);

  const handleContinue = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);
  return (
    <>
      <CardContainerOnBoarding>
        <form>
          <CardOnBoarding className="card_vendor">
            {currentStep === 0 && (
              <OrganizationProfile
                data={BUYER_COTS_ASSESSMENT.organizationProfile}
              />
            )}
            {currentStep === 1 && <UseCase data ={BUYER_COTS_ASSESSMENT.useCase} />}
            {currentStep === 2 && <VendorEvaluation data={BUYER_COTS_ASSESSMENT.vendorEvaluation} />}
            {currentStep === 3 && <Readiness data={BUYER_COTS_ASSESSMENT.readiness}/>}
            {currentStep === 4 && <RiskProfile data={BUYER_COTS_ASSESSMENT.riskProfile}/>}
            {currentStep === 5 && <VendoeRisk data={BUYER_COTS_ASSESSMENT.vendorRisk}/>}
            {currentStep === 6 && <Implementation  data={BUYER_COTS_ASSESSMENT.implementation} />}
            {/* {currentStep === 7 && <StepOperationsAndReliablity data={VENDOR_SELF_ATTESTATION.operations_reliability}  />} */}
            {/* {currentStep === 8 && <StepDeploymentAndArchitecture data={VENDOR_SELF_ATTESTATION.deployment_architecture} />} */}
            {/* {currentStep === 9 && <StepEvidenceAndSupoortDoc />} */}

            {/* {currentStep === 9 && !allStepsFilled && (
              <StepVendorSelfAttestationPrev />
            )} */}
            {currentStep === 6 && allStepsFilled && <CardConfirmation />}
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
            {currentStep < 6 && (
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
            {currentStep === 6 && !allStepsFilled && (
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
    </>
  );
};

export default BuyerAssessment;
