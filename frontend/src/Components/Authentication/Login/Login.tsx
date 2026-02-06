import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { LockKeyhole, Mail, ArrowRight, Eye, EyeOff, CheckCircle, CircleAlert } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  document.title = "AI Eval Platform | Sign in";

  const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";
  const navigate = useNavigate();
  const location = useLocation();
  const resetSuccess = (location.state as { resetSuccess?: boolean } | null)?.resetSuccess;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isUser, setIsUser] = useState({});
  const [isError, setError] = useState("");

  const getUser = async (e: any) => {
    e.preventDefault();

    const data = { email, password };
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
      let result: { token?: string; userDetails?: unknown[]; message?: string } = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setError(response.ok ? "Invalid response from server" : "Server error. Check that the API is running.");
        return;
      }
      if (response.ok) {
        // console.log(result.userDetails[0]);
        const bearerToken = result.token;
        const userDetails = result.userDetails[0];
        setIsUser(userDetails);
        console.log(userDetails);
        sessionStorage.setItem("bearerToken", bearerToken);
        sessionStorage.setItem("userEmail", userDetails.email);
        sessionStorage.setItem("userRole", userDetails.role);
        sessionStorage.setItem("userId", userDetails.id);
        sessionStorage.setItem("systemRole", userDetails.user_platform_role);
        sessionStorage.setItem(
          "user_signup_completed",
          userDetails.user_signup_completed,
        );
        sessionStorage.setItem(
          "user_onboarding_completed",
          userDetails.user_onboarding_completed,
        );
        // console.log(userDetails.email);
        // navigate("/");
        toast.success("Login successful!", { autoClose: 2000 });
        const nextPath = userDetails.user_onboarding_completed ? "/" : "/onBoarding";
        setTimeout(() => navigate(nextPath), 2000);
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const passwordVisible = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <>
      <div className="authPage">
        <div className="authContent">
          <div className="loginData">
            <div className="loginCred">
              <div className="loginForm">
                <p className="authPlatformTitle">AI Eval Platform</p>
                <h1 className="loginHeading">Sign in</h1>
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
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
                      <CheckCircle className="authMessage__icon" size={16} aria-hidden />
                      <p className="loginSuccess">
                        Password reset successfully. You can sign in with your new password.
                      </p>
                    </div>
                  )}
                  {isError && (
                    <div className="authMessage authMessage--error">
                      <CircleAlert className="authMessage__icon" size={16} aria-hidden />
                      <p className="orgError">{isError}</p>
                    </div>
                  )}
                  <div className="loginBtn">
                    <button type="submit" className="login-btn">
                      Signin{" "}
                      <span>
                        <ArrowRight width={20} />
                      </span>
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
