import { Mail, ArrowRight, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import "./resetPassword.css";
import { useState } from "react";

const ResetPassword = () => {
  document.title = "AI EVAL | Reset Password";

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const passwordVisible = () => {
    setIsVisible((prev) => !prev);
  };
  const confirmPasswordVisible = () => {
    setIsVisibleConfirm((prev) => !prev);
  };

  return (
    <>
      <div className="loginContainer">
        <div className="welcomeContent">
          <div className="welcomeText">
            <div>
              <h1 className="welcomeHeading">Reset Password</h1>
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
                <h1 className="loginHeading">Reset Password</h1>
                <form action="" autoComplete="off">
                  <div className="emailData">
                    <label htmlFor="loginEmail">
                      <span>
                        <Mail width={20} strokeWidth={1.5} />
                      </span>{" "}
                      Email
                    </label>
                    <input
                      className="resetMail"
                      type="email"
                      value="registered email"
                      readOnly
                    />
                  </div>
                  <div className="passwordData">
                    <label htmlFor="loginPassword">
                      <span>
                        <LockKeyhole width={20} strokeWidth={1.5} />
                      </span>
                      New Password
                    </label>
                    <input type={isVisible ? "text" : "password"} maxLength={16}/>
                    <span onClick={passwordVisible} className="passwordVisible">
                      {isVisible ? (
                        <Eye size={20} strokeWidth={1.5} />
                      ) : (
                        <EyeOff size={20} strokeWidth={1.5} />
                      )}
                    </span>
                  </div>
                  <div className="passwordData">
                    <label htmlFor="loginPassword">
                      <span>
                        <LockKeyhole width={20} strokeWidth={1.5} />
                      </span>
                      Confirm Password
                    </label>
                    <input type={isVisibleConfirm ? "text" : "password"} maxLength={16} />
                    <span
                      onClick={confirmPasswordVisible}
                      className="passwordVisible"
                    >
                      {isVisibleConfirm ? (
                        <Eye size={20} strokeWidth={1.5} />
                      ) : (
                        <EyeOff size={20} strokeWidth={1.5} />
                      )}
                    </span>
                  </div>
                  <div className="loginBtn">
                    <button type="submit" className="login-btn">
                      Confirm{" "}
                      <span>
                        <ArrowRight width={20} />
                      </span>
                    </button>
                  </div>
                  {/* <div>
                  <p className="signinText">
                    Remember your credentials?{" "}
                    <Link to="/login">
                      <span>Sign in</span>
                    </Link>
                  </p>
                </div> */}
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

export default ResetPassword;
