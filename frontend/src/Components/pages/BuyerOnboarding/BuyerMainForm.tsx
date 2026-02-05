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
import { buyerFormInitialState } from "../../../constants/buyerFormInitialState.ts";
import type { BuyerDataInterface } from "../../../types/formDataBuyer.ts";
import CardConfirmation from "../../UI/CardConfirmation.tsx";

const BuyerMainForm = ({ type }) => {
  useEffect(() => {
    document.title = "AI Eval | Buyer Onboarding";
  }, []);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  let vendor_Id = sessionStorage.getItem("userId");

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(0);
  // const [allStepsFilled, setAllStepsFilled] = useState<boolean>(false);
  const [formBuyerData, setFormBuyerData] = useState<BuyerDataInterface>(
    buyerFormInitialState,
  );
  const [allStepsFilled, setAllStepsFilled] = useState<boolean>(false);

  const handleContinue = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const hanldeBuyerOnboardingSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const Onboardingtoken = sessionStorage.getItem("onboardingToken");
    try {
      const response = await fetch(`${BASE_URL}/buyerOnboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Onboardingtoken}`,
        },
        body: JSON.stringify({
          ...formBuyerData,
          buyer_Id: vendor_Id,
          organization_Id: sessionStorage.getItem("organizationId") ?? undefined,
        }),
      });

      const result = await response.json();
      console.log(response)
      console.log(result);
      if (response.ok) {
        setAllStepsFilled(true); // mark form completed
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackToSelection = () => {
    navigate("/onboarding");
  };

  console.log("formBuyerData", formBuyerData);

  return (
    <>
      {/* <div className="main_form_content"> */}
      <CardContainerOnBoarding>
        <form action="" onSubmit={hanldeBuyerOnboardingSubmit}>
          <CardOnBoarding className="card_vendor">
            {currentStep === 0 && (
              <BuyerOrganizationProfile
                formBuyerData={formBuyerData}
                setFormBuyerData={setFormBuyerData}
              />
            )}
            {currentStep === 1 && (
              <BuyerContactInformation
                formBuyerData={formBuyerData}
                setFormBuyerData={setFormBuyerData}
              />
            )}
            {currentStep === 2 && (
              <BuyerOrganizationScale
                formBuyerData={formBuyerData}
                setFormBuyerData={setFormBuyerData}
              />
            )}
            {currentStep === 3 && (
              <BuyerGeopgraphy
                formBuyerData={formBuyerData}
                setFormBuyerData={setFormBuyerData}
              />
            )}
            {currentStep === 4 && (
              <CurrentAiMaturity
                formBuyerData={formBuyerData}
                setFormBuyerData={setFormBuyerData}
              />
            )}
            {currentStep === 5 && (
              <RegulatoryContext
                formBuyerData={formBuyerData}
                setFormBuyerData={setFormBuyerData}
              />
            )}
            {currentStep === 6 && (
              <TechnicalEnvironment
                formBuyerData={formBuyerData}
                setFormBuyerData={setFormBuyerData}
              />
            )}
            {currentStep === 7 && (
              <RiskAppetite
                formBuyerData={formBuyerData}
                setFormBuyerData={setFormBuyerData}
              />
            )}
            {/* {currentStep === 8 && <StepBuyerOnboardingPreview />} */}
            {/* {currentStep === 4 && <StepCustomerRiskMitigation/>} */}

            {/* Step 4: Preview or Confirmation */}
            {currentStep === 8 && !allStepsFilled && (
              <StepBuyerOnboardingPreview formBuyerData={formBuyerData} />
            )}
            {currentStep === 8 && allStepsFilled && (
              <CardConfirmation pageNavigateLink="" />
            )}
          </CardOnBoarding>

          {/* Navigation buttons */}
          <div className="vendor_action_btns">
            {/* Show back button only if confirmation is NOT shown */}
            {!allStepsFilled && (
              <div className="action_back">
                <Button
                  type="button"
                  onClick={
                    currentStep === 0 ? handleBackToSelection : handleBack
                  }
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
            {currentStep < 8 && (
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
            {currentStep === 8 && !allStepsFilled && (
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

      {/* </div> */}
    </>
  );
};

export default BuyerMainForm;
