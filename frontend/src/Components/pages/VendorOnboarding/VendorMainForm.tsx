// import React from 'react'

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

const VendorMainForm = () => {
  useEffect(() => {
    document.title = "AI Eval | Vendor Onboarding";
  }, []);

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);

  console.log("current step", currentStep);

  const handleContinue = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // this will navigate to the onboarding component
  const handleBackToSelection = () => {
    navigate("/onboarding");
  };

  const hanldeVendorOnboardingSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
  };
  return (
    <>
      <CardContainerOnBoarding>
        <form action="" onSubmit={hanldeVendorOnboardingSubmit}>
          <CardOnBoarding className="card_vendor">
            {currentStep === 0 && <StepCompanyProfile />}
            {currentStep === 1 && <StepContactInformation />}
            {currentStep === 2 && <StepCompanyScale />}
            {currentStep === 3 && <StepGeopgraphy />}
            {currentStep === 4 && <StepVendorOnboardingPreview />}
          </CardOnBoarding>

          {/* {currentStep === 4 && <StepCustomerRiskMitigation/>} */}

          <div className="vendor_action_btns">
            <div className="action_back">
              {currentStep === 0 ? (
                <>
                  <Button
                    type="button"
                    onClick={() => handleBackToSelection()}
                    className="back_btn"
                  >
                    <span>
                      <ChevronLeftCircle size={16} />
                      Back
                    </span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => handleBack()}
                    className="back_btn"
                  >
                    <span>
                      <ChevronLeftCircle size={16} />
                      Back
                    </span>
                  </Button>
                </>
              )}
            </div>
            {currentStep < 4 ? (
              <>
                <div className="action_continue_btn">
                  <Button
                    onClick={() => handleContinue()}
                    type="button"
                    className="continue_btn"
                  >
                    <span>
                      Continue <ChevronRightCircle size={16} />
                    </span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="action_submit_btn">
                  <Button type="submit" className="submit_btn_vendor">
                    <span>
                      Submit
                      <Send size={16} />
                    </span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>
      </CardContainerOnBoarding>
      {/* <div className="main_form_content"> */}

      {/* </div> */}
    </>
  );
};

export default VendorMainForm;
