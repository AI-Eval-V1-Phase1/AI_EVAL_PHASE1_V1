import { useEffect, useState } from "react";
import "./vendor_onboarding.css";
import Button from "../../UI/Button";
import StepCompanyProfile from "./StepCompanyProfile";
import StepContactInformation from "./StepContactInformation";
import StepCompanyScale from "./StepCompanyScale";
import StepGeopgraphy from "./StepGeopgraphy";
import { ChevronLeftCircle, ChevronRightCircle, Send } from "lucide-react";
import StepVendorOnboardingPreview from "./StepVendorOnboardingPreview";
import { useNavigate, useParams } from "react-router-dom";
import CardOnBoarding from "../../UI/CardOnBoarding";
import CardContainerOnBoarding from "../../UI/CardContainerOnBoarding";
import CardConfirmation from "../../UI/CardConfirmation";
import type { VendorDataInterface } from "../../../types/formDataVendor";

const VendorMainForm = ({ type }) => {
  useEffect(() => {
    document.title = "AI Eval | Vendor Onboarding";
  }, []);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
let vendor_Id = sessionStorage.getItem("userId");

  // console.log("AI Type",type)
  const navigate = useNavigate();

  const allDataVendor = {
    role: type,
    vendorId:vendor_Id,
    vendorType: "",
    sector: {
      public_sector: [],
      private_sector: [],
      non_profit_sector: [],
    },
    vendorMaturity: "",
    companyWebsite: "",
    companyDescription: "",
    primaryContactName: "",
    // formVendorData: "",
    primaryContactRole: "",
    employeeCount: "",
    yearFounded: "",
    headquartersLocation: "",
    operatingRegions: [],
  };

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [allStepsFilled, setAllStepsFilled] = useState<boolean>(false);
  const [formVendorData, setFormVendorData] =
    useState<VendorDataInterface>(allDataVendor);

  const handleContinue = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleBackToSelection = () => navigate("/onboarding");

  const handleSubmitPreview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
const token = sessionStorage.getItem("bearerToken");
const Onboardingtoken = sessionStorage.getItem("onboardingToken");
    try {
      const response = await fetch(`${BASE_URL}/vendorOnboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
              Authorization: `Bearer ${Onboardingtoken}`,
        },
        body: JSON.stringify(formVendorData),
      });

      const result = await response.json();
      console.log(result)
      if (response.ok) {
        setAllStepsFilled(true); // mark form completed
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CardContainerOnBoarding>
      <form onSubmit={handleSubmitPreview}>
        <CardOnBoarding className="card_vendor">
          {/* Render current step */}
          {currentStep === 0 && (
            <StepCompanyProfile
              formVendorData={formVendorData}
              setFormVendorData={setFormVendorData}
            />
          )}
          {currentStep === 1 && (
            <StepContactInformation
              formVendorData={formVendorData}
              setFormVendorData={setFormVendorData}
            />
          )}
          {currentStep === 2 && (
            <StepCompanyScale
              formVendorData={formVendorData}
              setFormVendorData={setFormVendorData}
            />
          )}
          {currentStep === 3 && (
            <StepGeopgraphy
              formVendorData={formVendorData}
              setFormVendorData={setFormVendorData}
            />
          )}

          {/* Step 4: Preview or Confirmation */}
          {currentStep === 4 && !allStepsFilled && (
            <StepVendorOnboardingPreview formVendorData={formVendorData} />
          )}
          {currentStep === 4 && allStepsFilled && (
            <CardConfirmation pageNavigateLink="Proceed to Vendor Attestation" />
          )}
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
