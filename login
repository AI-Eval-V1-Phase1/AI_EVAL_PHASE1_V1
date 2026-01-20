import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  document.title = "HR BOT | Login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasAcceptedCookies, setHasAcceptedCookies] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);



  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // console.log(emailRegex)
    return emailRegex.test(email);
  };

  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const getUser = async (e) => {
    e.preventDefault();
    if (e.isTrusted) {
      console.log("User clicked the signup button.");

      setTimeout(() => {
        setActiveBtn(true);
      }, 2000);
      setErrorMessage("");
      // setSuccessMessage("");
      setFadeOut(false); // Reset fade-out effect
      const data = { email, password };
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
          },
        );
        // console.log(response);
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          if (result) {
            const { userEmail, userName, Authentication, userId } = result;
            // console.log(result.userId)
            sessionStorage.setItem("userName", userName);
            sessionStorage.setItem("userId", userId);
            navigate("/hrbot", {
              replace: true,
              state: {
                userEmail: result.userEmail,
                userName: result.userName,
                Authentication: result.Authentication,
                userId: result.userId,
              },
            });

          }
          // console.log(result);
          setPasswordError(result.message);
        } else {
          const result = await response.json();
          const resMessage = result.message;
          setErrorMessage(resMessage);
          // console.log("Error: ", response.status);
        }
      } catch (err) {
        console.log("Request failed: ", err);
      }
    } else {
      console.log("Signup button clicked programmatically.");
    }
  };

  // useEffect(() => {
  //   const cookieExpiryDate = Cookies.get("cookieExpiryDate");  // Retrieve expiry date
  //   const currentDate = new Date();

  //   // If the cookie doesn't exist or if the expiry date has passed, show the popup
  //   if (!cookieExpiryDate || new Date(cookieExpiryDate) < currentDate) {
  //     setHasAcceptedCookies(false);  // Show the popup
  //   } else {
  //     setHasAcceptedCookies(true);  // Hide the popup if cookies are valid
  //   }
  // }, []);

  useEffect(() => {
    setHasAcceptedCookies(false); // Always show popup
  }, []);

  const passwordVisible = () => {
    setVisible((prev) => !prev);
  };
  const loginButtonAfterHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = "./src/assets/images/loginAfterHover.svg";
    }
  };
  const loginButtonBeforeHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = "./src/assets/images/login.svg";
    }
  };

  return (
    <>
      <div
        className={`login_container flex flex-col min-h-screen items-center justify-between w-screen bg-[#121212] text-white
        `}
      >
        <div className="fixed top-0 right-0 flex mt-4 mr-4 space-x-4">
          <Link
            to="/"
            className="flex flex-row items-center w-[110px] py-1 px-3 gap-0.5 justify-center  font-[500] rounded-[25px] bg-[#f1f1f1] text-[#283e46] border-[1.5px] border-amber-400"
          >
            <img
              src="./src/assets/images/home.svg"
              alt="Home"
              width={20}
              height={20}
              className="mb-1"
            />
            <span className="text-sm">Home</span>
          </Link>

          <Link
            to="/referralLogin"
            className="flex flex-row items-center w-[110px]  py-1 px-3 gap-0.5 justify-center  font-[500]  rounded-[25px] bg-[#f1f1f1] text-[#283e46] border-[1.5px] border-amber-400"
          >
            <img
              src="./src/assets/images/allReferralsIcon.svg"
              alt="Referrals"
              width={20}
              height={20}
              // className="mb-1"
            />
            <span className="text-sm">Referrals</span>
          </Link>
        </div>

        {/* Wrapper to center form */}
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-[400px] ">
            <form
              onSubmit={getUser}
              className="px-8 rounded-2xl"
              autoComplete="off"
            >
              <div className="text-center flex flex-col items-center">
                <img
                  src="./src/assets/images/qlogo.svg"
                  className="w-[80px] mb-2"
                  alt="Logo"
                />
              </div>
              <div className="text-base text-center font-semibold md:text-xl lg:text-2xl">
                <p>HR Bot</p>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block py-0.5 text-sm sm:text-base md:text-base lg:text-base"
                >
                  Email:
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value && password) setErrorMessage(""); // Clear error if both fields are filled
                  }}
                  className={`w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px] text-sm sm:text-base md:text-base lg:text-base ${
                    isDark ? "border-[white]" : "border-[#283E46]"
                  }`}
                />
                <div>
                  {/* First condition: Domain check */}
                  <div
                    className="flex items-center gap-1.5 h-[20px] text-red-600  mt-1 "
                    style={{
                      visibility:
                        email
                          ? "visible"
                          : "hidden",
                    }}
                  >
                    <img
                      src="./src/assets/images/error.svg"
                      className="w-[1em] h-[1em]"
                      alt="Error"
                    />
                    <p className="text-red-600  text-xs md:text-lg lg:text-[0.79em] xl:text-[0.79em]">
                      Only users with a qualesce.com email can login!
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Input with Toggle */}
              <div className="relative">
                <label
                  htmlFor="pwd"
                  className="block py-0.5 text-sm sm:text-base md:text-base lg:text-base"
                >
                  Password:
                  {/* Password<sup className="text-[#d90429] text-[0.7em] pl-1">*</sup> */}
                </label>
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  id="pwd"
                  maxLength={16}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (email && e.target.value) setErrorMessage("");
                  }}
                  className={`w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px] text-sm sm:text-base md:text-base lg:text-base ${
                    isDark ? "border-[white]" : "border-[#283E46]"
                  }`}
                />
                {/* Password Visibility Icon */}
                <img
                  className="absolute top-[27px] right-0 cursor-pointer"
                  src={
                    visible
                      ? isDark
                        ? "./src/assets/images/pwdOpenDark.svg"
                        : "./src/assets/images/pwdOpenIcon.svg"
                      : isDark
                        ? "./src/assets/images/pwdCloseDark.svg"
                        : "./src/assets/images/pwdCloseIcon.svg"
                  }
                  onClick={passwordVisible}
                  width="22"
                  alt="Toggle Password"
                />
              </div>

              {/* Display Error Message */}
              <div className="mt-3 h-[10px] flex items-center">
                {/* {successMessage && (
                  <div
                    className={`flex items-center gap-2 p-2  text-green-700 rounded-md w-full 
                    transition-opacity duration-1000 ease-in-out ${
                      successMessage ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src="./src/assets/images/success.svg"
                      width={20}
                      alt="Success"
                    />
                    <p className="text-sm">{successMessage}</p>
                  </div>
                )}{" "} */}
                {errorMessage && (
                  <div className="flex items-center gap-2  rounded-md w-full">
                    <img
                      src="./src/assets/images/error.svg"
                      width={20}
                      alt="Error"
                    />
                    <p className="text-[#d90429] text-sm lg:text-[0.79em]">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>

              {/* Login Button */}
              <div>
                <div>
                  {/* <div className="bg-gray-200 cursor-not-allowed">hi{activeBtn}</div> */}
                  <button
                    onMouseEnter={loginButtonAfterHover}
                    onMouseLeave={loginButtonBeforeHover}
                    className={`flex items-center justify-center gap-0.5 pb-1.5 pt-1 mt-3 bg-[#283E46] text-[1.3em] border border-[#283E46] cursor-pointer text-[#ffc300] w-full hover:text-[#283E46] hover:bg-white rounded-[25px] shadow-md transition 
                  text-[1em] sm:text-[1.1em] md:text-[1.1em] lg:text-[1.1em] xl:text-[1.3em] `}
                  >
                    Login
                    <img
                      src="./src/assets/images/login.svg"
                      width={29}
                      height={29}
                      className="inline-block"
                      alt="Login Icon"
                    />
                  </button>
                </div>

                {/* Forgot Password & Sign Up Links */}
                <div className="mt-4 flex items-center flex-col gap-0.5">
                  <Link
                    to="/forgotPassword"
                    className={`underline text-[#283E46] font-semibold text-xs sm:text-base md:text-base lg:text-base ${
                      isDark ? "text-[#ffc300]" : "text-[#283E46]"
                    }`}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
