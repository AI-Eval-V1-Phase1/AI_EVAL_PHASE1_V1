import { Mail, ArrowRight } from "lucide-react";

import "./forgotPassword.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    document.title = "AI EVAL | Forgot Password"
  return (
    <>
      <div className="loginContainer">
        <div className="welcomeContent">
          <div className="welcomeText">
            <div>
              <h1 className="welcomeHeading">Forgot Password</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                eum optio voluptatem, ea velit impedit ducimus praesentium magni
                laudantium unde.
              </p>
            </div>
          </div>
        </div>
        {/* <div> */}
        <div className="loginContent">
          <div className="loginData">
            <div className="loginCred">
              <div className="loginForm">
                <h1 className="loginHeading">Forgot Password</h1>
                <form action="" autoComplete="off">
                  <p className="mailText">
                    <span>*</span> Enter your registered email to receive a
                    password reset link
                  </p>
                  <div className="emailData">
                    <label htmlFor="loginEmail">
                      <span>
                        <Mail width={20} strokeWidth={1.5} />
                      </span>{" "}
                      Email
                    </label>
                    <input type="email" />
                  </div>
                  <div className="loginBtn">
                    <button type="submit" className="login-btn">
                      Submit{" "}
                      <span>
                        <ArrowRight width={20} />
                      </span>
                    </button>
                  </div>
                  <div>
                    <p className="signinText">
                      Remember your credentials?{" "}<Link to="/login"><span>Sign in</span></Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default ForgotPassword;
