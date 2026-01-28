import React, { useState } from "react";
import "./onboarding.css";
import { Store, ChevronRightCircle, Building2 } from "lucide-react";
import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [disableBtn, setDisabledBtn] = useState(true);
  const handleSelection = () => {
    if (role === "buyer") {
      navigate("/onboarding/buyerOnboarding");
    } else if (role === "vendor") {
      navigate("/onboarding/vendorOnboarding");
    }
  };

  const handleRole = (val: string) => {
    setRole(val);
    setDisabledBtn(false);
  };

  return (
    <>
      <div className="main_form_content ">
        <div className="onboarding_content">
          <div className="step_form_header">
            {/* <h2>Are you a Buyer or Vendor?</h2> */}
            <h2>How will you use this platform?</h2>
            <p className="modal_sub_title">
              This helps us perosonalize your experience and pre-fill assessment
              fields
            </p>
          </div>
          {/* <div className="onboarding_content"> */}
          <div className="onboarding_sec">
            <div className="radio-wrapper-22">
              <label className="radio-wrapper" htmlFor="buyer">
                <input
                  type="radio"
                  className="radio-input"
                  name="radio-examples"
                  id="buyer"
                  onClick={() => handleRole("buyer")}
                  checked={role === "buyer"}
                />
                <span className="radio-tile">
                  <span className="radio-icon">
                    {/* <User /> */}
                    <Building2 />
                  </span>
                  <span className="radio-label">Buyer</span>
                </span>
              </label>
            </div>
            <div className="radio-wrapper-22">
              <label className="radio-wrapper" htmlFor="example-22">
                <input
                  type="radio"
                  className="radio-input"
                  name="radio-examples"
                  id="example-22"
                  onClick={() => handleRole("vendor")}
                  checked={role === "vendor"}
                />
                <span className="radio-tile">
                  <span className="radio-icon">
                    {/* <Building2 /> */}
                    <Store />
                  </span>
                  <span className="radio-label">Vendor</span>
                </span>
              </label>
            </div>
          </div>

          <div className="action_btns">
            <Button
              onClick={handleSelection}
              type="button"
              className="continue_btn"
              disabled={disableBtn}
            >
              <span>
                Continue <ChevronRightCircle size={16} />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* </div> */}
    </>
  );
};

export default Onboarding;
