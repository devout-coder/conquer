import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Signup.css";
import google_logo from "../../images/google_logo.png";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { IconButton } from "@material-ui/core";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import firebaseApp from "../../firebase";
import Loading from "../Loading/Loading";
import firebase from "firebase";

function Signup() {
  const history = useHistory();
  const [loading, setLoading] = useState(null);
  const [username, setUsername] = useState("");
  const [wantsPassword, setWantsPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async (e) => {
    setLoading(true); //this prompts to render the custom Loading component which is a loading circle
    try {
      await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
      firebaseApp.auth().currentUser.updateProfile({ displayName: username });
      history.push("/daily");
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const signUpgoogle = async () => {
    setLoading(true);
    let provider = new firebase.auth.GoogleAuthProvider();
    await firebaseApp
      .auth()
      .signInWithPopup(provider)
      .catch((error) => {
        setLoading(false);
        alert(error.message);
      });
    history.push("/daily");
  };

  const toggle = () => {
    //this toggles the password field from password type(and enable visibilty button) and text type(and disable visibilty button)
    setWantsPassword(!wantsPassword);
    if (wantsPassword) {
      return (document.getElementById("passwordField").type = "password");
    } else {
      return (document.getElementById("passwordField").type = "text");
    }
  };

  return !loading ? (
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
            Have an account?&nbsp;<Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default Signup;
