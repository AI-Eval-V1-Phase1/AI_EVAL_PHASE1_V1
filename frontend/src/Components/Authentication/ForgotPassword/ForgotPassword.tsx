import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import "../Login/login.css";
import "./forgotPassword.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  document.title = "AI EVAL | Forgot Password";

  const BASE_URL = (import.meta.env.VITE_BASE_URL ?? "").toString().trim();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "If an account exists with this email, you will receive a password reset link shortly.");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Unable to connect. Please try again later.");
    }
  };

  return (
    <>
      <div className="authPage">
        <div className="authContent">
          <div className="loginData">
            <div className="loginCred">
              <div className="loginForm">
                <h1 className="loginHeading">Forgot Password</h1>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <p className="mailText">
                    <span>*</span> Enter your registered email to receive a
                    password reset link
                  </p>
                  <div className="emailData">
                    <label htmlFor="forgotEmail">
                      <span>
                        <Mail width={20} strokeWidth={1.5} />
                      </span>{" "}
                      Email
                    </label>
                    <input
                      id="forgotEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={status === "loading"}
                    />
                  </div>
                  {message && (
                    <p
                      className={
                        status === "success" ? "forgotSuccess" : "forgotError"
                      }
                    >
                      {message}
                    </p>
                  )}
                  <div className="loginBtn">
                    <button
                      type="submit"
                      className="login-btn"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? "Sending…" : "Submit"}{" "}
                      <span>
                        <ArrowRight width={20} />
                      </span>
                    </button>
                  </div>
                  <div>
                    <p className="signinText">
                      Remember your credentials?{" "}
                      <Link to="/login">
                        <span>Sign in</span>
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

export default ForgotPassword;
