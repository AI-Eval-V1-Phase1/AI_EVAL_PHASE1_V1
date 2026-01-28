
import { Outlet } from "react-router-dom";
import { Shield } from "lucide-react";

const LayoutWithoutNav = () => {
  return (
    <>
      <div className="container onBoarding_container">
         <div className="step_form_header welcome_msg_onboarding">
          {/* <h2>Are you a Buyer or Vendor?</h2> */}
           <div className="logo_sec">
            <Shield className="logo_img" size={40} />
           
          </div>
          <h2>Welcome to AI Eval!</h2>
          <p className="modal_sub_title">Let's set up your account in jusr few steps</p>
        </div>
        <main className="main_container">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default LayoutWithoutNav;
