import {
  Mail,
  ArrowRight,
  LockKeyhole,
  Eye,
  EyeOff,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";
import "../Login/login.css";
import "../ResetPassword/resetPassword.css";
import "./signup.css";
import { useEffect, useState } from "react";
import type { SignUpdata } from "../Validations/sign_up_validations";
<<<<<<< HEAD
import {
  useNavigate,
  useSearchParams,
  useParams,
  Link,
} from "react-router-dom";
=======
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
import { jwtDecode } from "jwt-decode";
import CardContainerOnBoarding from "../../UI/CardContainerOnBoarding";
import HeaderForAuth from "../../UI/HeaderForAuth";

const SignUp = () => {
  useEffect(() => {
    document.title = "AI Eval Platform | Sign Up";
  }, []);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmSignup, setIsConfirmSignup] = useState(false);
  const [onboardingEmailSent, setOnboardingEmailSent] = useState(false);
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // console.log("here")
  const decode = jwtDecode(token);

  let decodeEmail = decode.email;

  // After signup success: redirect to sign in after a few seconds
  const REDIRECT_DELAY_MS = 5000;
  const LOGIN_PATH = "/login";
  useEffect(() => {
    if (!isConfirmSignup) return;
    const timer = setTimeout(() => {
      navigate(LOGIN_PATH, { replace: true });
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isConfirmSignup, navigate]);

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
  const isDisabledBtn =
    Object.values(signUpFormData).some((val) => val.trim() === "") || isLoading;

  const hanldeSubmitSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError("");
    try {
      const response = await fetch(`${BASE_URL}/signupData/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpFormData),
      });
      const result = await response.json();
      if (response.ok) {
        setIsConfirmSignup(true);
        setOnboardingEmailSent(Boolean(result.onboardingEmailSent));
        sessionStorage.setItem("signup_completed", "true");
<<<<<<< HEAD
        if (signUpFormData.email && signUpFormData.newPassword) {
          sessionStorage.setItem("signupEmail", signUpFormData.email.trim().toLowerCase());
          sessionStorage.setItem("signupPassword", signUpFormData.newPassword);
        }
=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
        setSignUpFormData({
          email: decodeEmail,
          firstName: "",
          lastName: "",
          userName: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setIsError(result.message ?? "Sign up failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setIsError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="authPage">
        <div className="signupContent authContent">
          {/* <h1>hhh</h1> */}
          {isConfirmSignup ? (
            <CardContainerOnBoarding>
<<<<<<< HEAD
              {/* <HeaderForAuth /> */}

              <div className="signup_confirmation_wrapper">
                <div className="signup_confirmation_card authMessage authMessage--success">
                  <CheckCircle
                    size={24}
                    aria-hidden
                    className="confirm_onboarding"
                  />
                  <p className="text_signup">
                    <span>
                      Your account has been{" "}
                      <span className="sucess_text">
                        successfully activated.
                      </span>
                      <span>
                        {onboardingEmailSent
                          ? " Please check your email to complete onboarding."
                          : ""}{" "}
                      </span>
                    </span>
                    <span> You will be redirected to sign in shortly.</span>
                  </p>
                  <p className="small_text">
                    Redirecting to sign in in a few seconds…
                  </p>
                  <p className="signin_btn">
                    <Link to={LOGIN_PATH}>
                      Sign in
                      <ArrowRight />
                    </Link>{" "}
                  </p>
                  <span className="small_text">
                    to continue to your account.
                  </span>
=======
              <div className="signup_confirmation_wrapper">
                <div className="signup_confirmation_card authMessage authMessage--success">
                  <CheckCircle
                    className="authMessage__icon signup_success_note"
                    size={24}
                    aria-hidden
                  />
                  <p style={{ margin: 0, fontSize: "14px", color: "#0f766e" }}>
                    Your account has been successfully activated.
                    {onboardingEmailSent
                      ? " Please check your email to complete onboarding."
                      : ""}{" "}
                    You will be redirected to sign in shortly.
                  </p>
                  <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#64748b" }}>
                    Redirecting to sign in in a few seconds…
                  </p>
                  <p style={{ margin: "12px 0 0", fontSize: "14px" }}>
                    <Link to={LOGIN_PATH} style={{ color: "var(--main-auth-button-color, #2463eb)", fontWeight: 600 }}>
                      Sign in
                    </Link>
                    {" "}
                    to continue to your account.
                  </p>
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
                </div>
              </div>
            </CardContainerOnBoarding>
          ) : (
<<<<<<< HEAD
            <div className="loginData">
              <div className="loginCred">
                <HeaderForAuth />
                <div className="loginForm">
                  <p className="loginHeading">Sign up</p>
                  <form
                    action=""
                    autoComplete="off"
                    onSubmit={hanldeSubmitSignUp}
                  >
                    <p className="loginCaption mailText">
                      Create an account to get started with the AI Eval
                      platform.
                    </p>
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
                    {isError && <p className="orgError">{isError}</p>}
                    <div className="loginBtn">
                      <button
                        type="submit"
                        className={`login-btn ${isDisabledBtn ? "disabled_css" : ""} ${isLoading ? "auth_btn_loading" : ""}`}
                        disabled={isDisabledBtn}
                        aria-busy={isLoading}
                      >
                        {isLoading ? (
                          <>
                            Signing up…
                            <Loader2
                              className="auth_spinner"
                              size={20}
                              aria-hidden
                            />
                          </>
                        ) : (
                          <>
                            Sign Up
                            <span>
                              <ArrowRight width={20} />
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                    {/* {isLinkVisible && (
=======
          <div className="loginData">
            <div className="loginCred">
              <HeaderForAuth />
              <div className="loginForm">
                <p className="loginHeading">Sign up</p>
                <form
                  action=""
                  autoComplete="off"
                  onSubmit={hanldeSubmitSignUp}
                >
                   <p className="loginCaption mailText">
                   Create an account to get started with the AI Eval platform.
                  </p>
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
                  {isError && <p className="orgError">{isError}</p>}
                  <div className="loginBtn">
                    <button
                      type="submit"
                      className={`login-btn ${isDisabledBtn ? "disabled_css" : ""} ${isLoading ? "auth_btn_loading" : ""}`}
                      disabled={isDisabledBtn}
                      aria-busy={isLoading}
                    >
                      {isLoading ? (
                        <>
                          Signing up…
                          <Loader2 className="auth_spinner" size={20} aria-hidden />
                        </>
                      ) : (
                        <>
                          Sign Up
                          <span>
                            <ArrowRight width={20} />
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                  {/* {isLinkVisible && (
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
                    <div>
                      <p className="signinText">
                        Proceed to <Link to="/login"><span>Login</span></Link>
                      </p>
                    </div>
                  )} */}
<<<<<<< HEAD
                  </form>
                </div>
              </div>
            </div>
=======
                </form>
              </div>
            </div>
          </div>
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
          )}
        </div>
      </div>
    </>
  );
};

export default SignUp;
