import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Login.css";
import google_logo from "../../images/google_logo.png";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { IconButton } from "@material-ui/core";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

function Login() {
  const [wantsPassword, setWantsPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = () => {};
  const loginGoogle = () => {};
  const toggle = () => {
    setWantsPassword(!wantsPassword);
    if (wantsPassword) {
      return (document.getElementById("passwordField").type = "password");
    } else {
      return (document.getElementById("passwordField").type = "text");
    }
  };
  return (
    <div className="login">
      <Navbar />
      <div className="loginPage">
        <div className="loginForm">
          <div className="field">
            <div className="fieldName">Email</div>
            <input
              type="email"
              value={email}
              spellCheck="false"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <div className="fieldName">Password</div>
            <input
              type="password"
              value={password}
              id="passwordField"    
              spellCheck="false"
              onChange={(e) => setPassword(e.target.value)}
            />
            <IconButton onClick={() => toggle()}>
              {wantsPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </div>
          <button className="loginButton" onClick={login}>
            Login
          </button>
          <button
            className="loginButton googleLoginButton"
            onClick={loginGoogle}
          >
            <span>Login with</span>
            <img src={google_logo} alt="" />
          </button>
          <div className="signupText">
            Don't have an account?&nbsp;<Link to="/signup">Signup</Link>
          </div>
        </div>  
      </div>
    </div>
  );
}

export default Login;
