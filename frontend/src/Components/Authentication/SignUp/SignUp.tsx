import {
  Mail,
  ArrowRight,
  LockKeyhole,
  Eye,
  EyeOff,
  User,
  CheckCircle,
} from "lucide-react";
import "../ResetPassword/resetPassword.css";
import "./signup.css";
import { useEffect, useState } from "react";
import type { SignUpdata } from "../Validations/sign_up_validations";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import CardContainerOnBoarding from "../../UI/CardContainerOnBoarding";

const SignUp = () => {
  useEffect(() => {
    document.title = "AI EVAL | Sign Up";
  });
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useParams();
  const [isVisible, setIsVisible] = useState(false);

  // console.log("here")
  const decode = jwtDecode(token);

  let decodeEmail = decode.email;

  console.log(decodeEmail);

  const passwordVisible = () => {
    setIsVisible((prev) => !prev);
  };
  const confirmPasswordVisible = () => {
    setIsVisibleConfirm((prev) => !prev);
  };

  const [signUpFormData, setSignUpFormData] = useState<SignUpdata>({
    email: decodeEmail,
    firstName: "",
    lastName: "",
    userName: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log(signUpFormData);
  const isDisabledBtn = Object.values(signUpFormData).some(
    (val) => val.trim() === "",
  );
  console.log(isDisabledBtn);

  const hanldeSubmitSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(signUpFormData);
    try {
      const response = await fetch(`${BASE_URL}/signupData/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpFormData),
      });
      // console.log("response", response);
      const result = await response.json();
      if (response.ok) {
        toast.success("Sign Up Successful!");
        // setIsVisible(true);
        sessionStorage.setItem("signup_completed", "true");
        console.log("Sign up token for onboarding", result.token);
        console.log("Sign up user id for onboarding", result.userId);
        setTimeout(() => {
          // navigate("/onBoarding");
        }, 2000);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }

    // console.log(signUpFormData);
  };

  return (
    <>
      <div className="loginContainer">
        <div className="welcomeContent">
          <div className="welcomeText">
            <div>
              <h1 className="welcomeHeading">Sign Up</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                eum optio voluptatem, ea velit impedit ducimus praesentium magni
                laudantium unde.
              </p>
            </div>
          </div>
        </div>
        <div className="signupContent">
          {/* <h1>hhh</h1> */}
          {isVisible && (
            <CardContainerOnBoarding>
              <div className="signup_confirmation_wrapper">
                <div className="signup_confirmation_card">
                  <CheckCircle className="signup_success_note" size={24} />
                  {/* <h2>Welcome to AI Eval!</h2> */}
                  <p>
                    Your AI Eval account has been successfully activated. Please
                    check your email to complete the onboarding process
                  </p>
                </div>
              </div>
            </CardContainerOnBoarding>
          )}

          <div className="loginData">
            <div className="loginCred">
              <div className="loginForm">
                <h1 className="loginHeading">Sign up</h1>
                <form
                  action=""
                  autoComplete="off"
                  onSubmit={hanldeSubmitSignUp}
                >
                  <div className="sign_up_form">
                    <div className="sign_up_form_rows">
                      <div className="emailData">
                        <label htmlFor="loginEmail">
                          <span>
                            <Mail width={20} strokeWidth={1.5} />
                          </span>{" "}
                          Email
                        </label>
                        <input
                          className="resetMail readOnlyField"
                          type="email"
                          name="email"
                          value={signUpFormData.email}
                          readOnly
                        />
                      </div>

                      <div className="passwordData">
                        <label htmlFor="loginEmail">
                          <span>
                            <User width={20} strokeWidth={1.5} />
                          </span>{" "}
                          User Name
                        </label>
                        <input
                          //   className="resetMail"
                          type="text"
                          name="userName"
                          value={signUpFormData.userName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="sign_up_form_rows">
                      <div className="emailData">
                        <label htmlFor="loginEmail">
                          <span>
                            <User width={20} strokeWidth={1.5} />
                          </span>{" "}
                          First Name
                        </label>
                        <input
                          //   className="resetMail"
                          type="text"
                          name="firstName"
                          value={signUpFormData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="emailData">
                        <label htmlFor="loginEmail">
                          <span>
                            <User width={20} strokeWidth={1.5} />
                          </span>{" "}
                          Last Name
                        </label>
                        <input
                          //   className="resetMail"
                          type="text"
                          name="lastName"
                          value={signUpFormData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="sign_up_form_rows">
                      <div className="passwordData">
                        <label htmlFor="loginPassword">
                          <span>
                            <LockKeyhole width={20} strokeWidth={1.5} />
                          </span>
                          New Password
                        </label>
                        <input
                          type={isVisible ? "text" : "password"}
                          maxLength={16}
                          name="newPassword"
                          value={signUpFormData.newPassword}
                          onChange={handleChange}
                        />
                        <span
                          onClick={passwordVisible}
                          className="passwordVisible"
                        >
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
                        <input
                          type={isVisibleConfirm ? "text" : "password"}
                          name="confirmPassword"
                          value={signUpFormData.confirmPassword}
                          maxLength={16}
                          onChange={handleChange}
                        />
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
                    </div>
                  </div>
                  <div className="loginBtn">
                    <button
                      type="submit"
                      className={`login-btn ${isDisabledBtn ? "disabled_css" : " "}`}
                      disabled={isDisabledBtn}
                    >
                      Sign Up{" "}
                      <span>
                        <ArrowRight width={20} />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
