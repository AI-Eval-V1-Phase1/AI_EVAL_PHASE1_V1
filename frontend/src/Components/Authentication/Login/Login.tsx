import { useState } from "react";
import "./login.css";

import { LockKeyhole, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  document.title = "AI EVAL | Login";

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isUser, setIsUser] = useState({});

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
      console.log(response);
      const result = await response.json();
      if (response.ok) {
        navigate("/");
        console.log(result.userDetails[0]);
        const userDetails = result.userDetails[0];
        setIsUser(userDetails);

        sessionStorage.setItem("userEmail", userDetails.email);
        sessionStorage.setItem("userRole", userDetails.role);
        sessionStorage.setItem("userId", userDetails.id);
        // console.log(userDetails.email);
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
      <div className="loginContainer">
        <div className="welcomeContent">
          <div className="welcomeText">
            <div>
              <h1 className="welcomeHeading">Welcome to Website</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                eum optio voluptatem, ea velit impedit ducimus praesentium magni
                laudantium unde.
              </p>
            </div>
          </div>
        </div>
        <div className="loginContent">
          <div className="loginData">
            <div className="loginCred">
              <div className="loginForm">
                <h1 className="loginHeading">User Login</h1>
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

                  <div className="loginBtn">
                    <button type="submit" className="login-btn">
                      Login{" "}
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
