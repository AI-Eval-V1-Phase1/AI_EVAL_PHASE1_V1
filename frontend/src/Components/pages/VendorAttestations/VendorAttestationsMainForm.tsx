import { useEffect, useState } from "react";
import CardContainerOnBoarding from "../../UI/CardContainerOnBoarding";
import CardOnBoarding from "../../UI/CardOnBoarding";
import StepProductProfile from "./StepProductProfile";
import Button from "../../UI/Button";
import { ChevronLeftCircle } from "lucide-react";
import { ChevronRightCircle } from "lucide-react";
import { Send } from "lucide-react";

import StepCompanyProfileAttestation from "./StepCompanyProfileAttestation";
import StepDocUpload from "./StepDocUpload";
import StepAITechCapabilities from "./StepAITechCapabilities";
import StepComplianceAndCertifications from "./StepComplianceAndCertifications";
import StepDataHandlingAndPrivacy from "./StepDataHandlingAndPrivacy";
import StepAiSafetyAndTesting from "./StepAiSafetyAndTesting";
import StepOperationsAndReliablity from "./StepOperationsAndReliablity";
import StepEvidenceAndSupoortDoc from "./StepEvidenceAndSupoortDoc";
import StepDeploymentAndArchitecture from "./StepDeploymentAndArchitecture";
import StepVendorSelfAttestationPrev from "./StepVendorSelfAttestationPrev";
import CardConfirmation from "../../UI/CardConfirmation";
import { VENDOR_SELF_ATTESTATION } from "../../../constants/vendorAttestionData";


const VendorAttestationsMainForm = () => {

  useEffect(() => {
    document.title = "AI Eval | Vendor Attestation"
  })
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [allStepsFilled, setAllStepsFilled] = useState<boolean>(false);

  const handleContinue = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  // const handleBackToSelection = () =>
  // navigate(`/onboarding/${Onboardingtoken}`);

  return (
    <>
      <CardContainerOnBoarding>
        <form>
          <CardOnBoarding className="card_vendor">
            {/* components of step forms */}
            {currentStep === 0 && <StepCompanyProfileAttestation data ={VENDOR_SELF_ATTESTATION.company_profile} />}
            {currentStep === 1 && <StepDocUpload data ={VENDOR_SELF_ATTESTATION.document_upload} />}
            {currentStep === 2 && <StepProductProfile data={VENDOR_SELF_ATTESTATION.product_profile} />}
            {currentStep === 3 && <StepAITechCapabilities data={VENDOR_SELF_ATTESTATION.ai_technical_capabilities}/>}
            {currentStep === 4 && <StepComplianceAndCertifications data={VENDOR_SELF_ATTESTATION.compliance_certifications}/>}
            {currentStep === 5 && <StepDataHandlingAndPrivacy data={VENDOR_SELF_ATTESTATION.data_handling_privacy}/>}
            {currentStep === 6 && <StepAiSafetyAndTesting  data={VENDOR_SELF_ATTESTATION.ai_safety_testing} />}
            {currentStep === 7 && <StepOperationsAndReliablity data={VENDOR_SELF_ATTESTATION.operations_reliability}  />}
            {currentStep === 8 && <StepDeploymentAndArchitecture data={VENDOR_SELF_ATTESTATION.deployment_architecture} />}
            {currentStep === 9 && <StepEvidenceAndSupoortDoc data={VENDOR_SELF_ATTESTATION.evidence_supporting_documentation}/>}

            {currentStep === 9 && !allStepsFilled && (
              <StepVendorSelfAttestationPrev />
            )}
            {currentStep === 9 && allStepsFilled && <CardConfirmation />}
          </CardOnBoarding>

          {/* Navigation buttons */}
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
            {currentStep < 9 && (
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
            {currentStep === 9 && !allStepsFilled && (
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

export default VendorAttestationsMainForm;
