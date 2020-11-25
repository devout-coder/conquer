import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Signup.css";
import google_logo from "../../images/google_logo.png";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { IconButton } from "@material-ui/core";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

function Signup() {
  const [username, setUsername] = useState("");
  const [wantsPassword, setWantsPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signUp = () => {};
  const signUpgoogle = () => {};
  const toggle = () => {
    setWantsPassword(!wantsPassword);
    if (wantsPassword) {
      return (document.getElementById("passwordField").type = "password");
    } else {
      return (document.getElementById("passwordField").type = "text");
    }
  };
  return (
    <div className="signup">
      <Navbar />
      <div className="signupPage">
        <div className="signupForm">
          <div className="field">
            <div className="fieldName">Username</div>
            <input
              type="text"
              spellCheck="false"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <button className="signupButton" onClick={signUp}>
            Sign Up
          </button>
          <button
            className="signupButton googleSignupButton"
            onClick={signUpgoogle}
          >
            <span>Sign Up with</span>
            <img src={google_logo} alt="" />
          </button>
          <div className="loginText">
            Have an account?&nbsp;<Link to="/Login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
