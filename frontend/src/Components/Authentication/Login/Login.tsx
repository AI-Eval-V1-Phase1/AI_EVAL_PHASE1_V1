import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  LockKeyhole,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  CircleAlert,
  Loader2,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import HeaderForAuth from "../../UI/HeaderForAuth";
const Login = () => {
  document.title = "AI Eval Platform | Sign in";

  const BASE_URL =
    import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";
  const navigate = useNavigate();
  const location = useLocation();
  const resetSuccess = (location.state as { resetSuccess?: boolean } | null)
    ?.resetSuccess;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isUser, setIsUser] = useState({});
  const [isError, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getUser = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = {
      email: email.trim().toLowerCase(),
      password,
    };
    // console.log(data);

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const text = await response.text();
      let result: {
        token?: string;
        userDetails?: unknown[];
        message?: string;
      } = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setError(
          response.ok
            ? "Invalid response from server"
            : "Server error. Check that the API is running.",
        );
        setIsLoading(false);
        return;
      }
      if (response.ok) {
        const bearerToken = result.token;
        const userDetails = result.userDetails?.[0];
        if (!userDetails || !bearerToken) {
          setError("Invalid response from server");
          setIsLoading(false);
          return;
        }
        setIsUser(userDetails);
        sessionStorage.setItem("bearerToken", bearerToken);
        sessionStorage.setItem("userEmail", userDetails.email ?? "");
        sessionStorage.setItem(
          "userRole",
          userDetails.role != null ? String(userDetails.role).trim() : "",
        );
        sessionStorage.setItem("userId", String(userDetails.id ?? ""));
        sessionStorage.setItem(
          "organizationName",
          String(userDetails.organization_name ?? "").trim(),
        );
        sessionStorage.setItem(
          "userName",
          String(userDetails.user_name ?? "").trim(),
        );
        sessionStorage.setItem(
          "userFirstName",
          String(userDetails.user_first_name ?? "").trim(),
        );
        sessionStorage.setItem(
          "userLastName",
          String(userDetails.user_last_name ?? "").trim(),
        );
        const platformRole = userDetails.user_platform_role;
        sessionStorage.setItem(
          "systemRole",
          platformRole != null && platformRole !== ""
            ? String(platformRole).trim()
            : "",
        );
        sessionStorage.setItem(
          "user_signup_completed",
          String(userDetails.user_signup_completed ?? "false"),
        );
        sessionStorage.setItem(
          "user_onboarding_completed",
          String(userDetails.user_onboarding_completed ?? "false"),
        );
        toast.success("Login successful!", { autoClose: 2000 });
        const nextPath =
          userDetails.user_onboarding_completed === true ||
          userDetails.user_onboarding_completed === "true"
            ? "/"
            : "/onBoarding";
        setTimeout(() => navigate(nextPath), 2000);
      } else {
        setError(
          result.message || "Login failed. Check your email and password.",
        );
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordVisible = () => {
    setIsVisible((prev) => !prev);
  };

  const isDisabledBtn = !email.trim() || !password.trim() || isLoading;

  return (
    <>
      <div className="authPage">
        <div className="authContent">
          <div className="loginData">
            <div className="loginCred">
              <HeaderForAuth/>
              <div className="loginForm">
                <p className="loginHeading">Welcome</p>
                <p className="loginCaption">Sign in to your AI EVAL account</p>
                <form action="" autoComplete="off" onSubmit={getUser}>
                  <div className="emailData">
                    <label htmlFor="loginEmail">
                      <span>
                        <Mail width={20} strokeWidth={1.5} />
                      </span>{" "}
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (isError) setError("");
                      }}
                      placeholder="johndoe@domain.com"
                      aria-invalid={!!isError}
                    />
                  </div>
                  <div className="passwordData">
                    <label htmlFor="loginPassword">
                      <span>
                        <LockKeyhole width={20} strokeWidth={1.5} />
                      </span>
                      Password
                    </label>
                    <input
                      type={isVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (isError) setError("");
                      }}
                      placeholder="......."
                      aria-invalid={!!isError}
                    />
                    <span onClick={passwordVisible} className="passwordVisible">
                      {isVisible ? (
                        <Eye size={20} strokeWidth={1.5} />
                      ) : (
                        <EyeOff size={20} strokeWidth={1.5} />
                      )}
                    </span>
                  </div>
                  {resetSuccess && (
                    <div className="authMessage authMessage--success">
                      <CheckCircle
                        className="authMessage__icon"
                        size={16}
                        aria-hidden
                      />
                      <p className="loginSuccess">
                        Password reset successfully. You can sign in with your
                        new password.
                      </p>
                    </div>
                  )}
                  {isError && (
                    <div
                      className="authMessage authMessage--error"
                      style={{ marginTop: "0.5em", marginBottom: 0 }}
                    >
                      <CircleAlert
                        className="authMessage__icon"
                        size={16}
                        aria-hidden
                      />
                      <p className="orgError">{isError}</p>
                    </div>
                  )}
                  <div className="loginBtn">
                    <button
                      type="submit"
                      className={`login-btn ${isDisabledBtn ? "disabled_css" : ""} ${isLoading ? "auth_btn_loading" : ""}`}
                      disabled={isDisabledBtn}
                      aria-busy={isLoading}
                    >
                      {isLoading ? (
                        <>
                          Signing in…
                          <Loader2
                            className="auth_spinner"
                            size={20}
                            aria-hidden
                          />
                        </>
                      ) : (
                        <>
                          Sign in
                          <span>
                            <ArrowRight width={20} />
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                  <div>
                    <p className="forgotPassword">
                      <Link to="/forgotPassword">
                        <span>Forgot Password?</span>
                      </Link>
                    </p>
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

export default Login;
