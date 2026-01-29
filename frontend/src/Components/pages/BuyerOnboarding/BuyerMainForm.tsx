// import React from 'react'

import { useEffect, useState } from "react";
// import "./buyer_onboarding.css";
import Button from "../../UI/Button";
import BuyerContactInformation from "./BuyerContactInformation";
import BuyerOrganizationScale from "./BuyerOrganizationScale";
import BuyerGeopgraphy from "./BuyerGeopgraphy";
import { ChevronLeftCircle, ChevronRightCircle, Send } from "lucide-react";
import StepBuyerOnboardingPreview from "./StepBuyerOnboardingPreview";
import BuyerOrganizationProfile from "./BuyerOrganizationProfile";
import CurrentAiMaturity from "./CurrentAiMaturity";
import RegulatoryContext from "./RegulatoryContext";
import TechnicalEnvironment from "./TechnicalEnvironment";
import RiskAppetite from "./RiskAppetite";
import { useNavigate } from "react-router-dom";
import CardOnBoarding from "../../UI/CardOnBoarding";
import CardContainerOnBoarding from "../../UI/CardContainerOnBoarding";

const BuyerMainForm = () => {
  useEffect(() => {
    document.title = "AI Eval | Buyer Onboarding";
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

  const hanldeBuyerOnboardingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleBackToSelection = () => {
    navigate("/onboarding");
  };
  return (
    <>
      {/* <div className="main_form_content"> */}
      <CardContainerOnBoarding>
        <form action="" onSubmit={hanldeBuyerOnboardingSubmit}>
          <CardOnBoarding className="card_vendor">
            {currentStep === 0 && <BuyerOrganizationProfile />}
            {currentStep === 1 && <BuyerContactInformation />}
            {currentStep === 2 && <BuyerOrganizationScale />}
            {currentStep === 3 && <BuyerGeopgraphy />}
            {currentStep === 4 && <CurrentAiMaturity />}
            {currentStep === 5 && <RegulatoryContext />}
            {currentStep === 6 && <TechnicalEnvironment />}
            {currentStep === 7 && <RiskAppetite />}
            {currentStep === 8 && <StepBuyerOnboardingPreview />}
            {/* {currentStep === 4 && <StepCustomerRiskMitigation/>} */}
          </CardOnBoarding>

          {/* <div className="action_btns"> */}
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
            {currentStep < 8 ? (
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

      {/* </div> */}
    </>
  );
};

export default BuyerMainForm;
