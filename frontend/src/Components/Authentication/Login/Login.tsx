import "./login.css";

const Login = () => {
  document.title = "Document | Login";

  return (
    <>
      <div className="loginContainer">
        <div className="loginWrapper">
          <div className="loginContent">
            <div className="loginData">
              <div className="loginImg">
                {/* <img
                src=""
                alt="AI EVAL"
                width={600}
              /> */}
                <h1>Welcome to Website</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
                  quia corporis laboriosam dolores natus sint nobis asperiores
                  ipsam aliquid voluptates?
                </p>
              </div>
              <div className="loginCred">
                <div>
                  <h1 className="loginHeading">User Login</h1>
                  <div className="emailData">
                    <label htmlFor="loginEmail">Email</label>
                    <input type="email" />
                  </div>
                  <div className="passwordData">
                    <label htmlFor="loginPassword">Password</label>
                    <input type="password" />
                  </div>
                  <div>
                    <p>Forgot Password</p>
                  </div>
                  <div>
                    <button>Login</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
