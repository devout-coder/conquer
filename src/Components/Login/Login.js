import React, { useState, forwardRef } from "react";
import { Link, useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Login.css";
import google_logo from "../../images/google_logo.png";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
} from "@material-ui/core";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Loading from "../Loading/Loading";
import firebaseApp from "../../firebase";
import firebase from "firebase";

function Login() {
  const history = useHistory();
  const [wantsPassword, setWantsPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(null);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);

  const login = async () => {
    setLoading(true); //this prompts to render the custom Loading component which is a loading circle
    try {
      await firebaseApp.auth().signInWithEmailAndPassword(email, password);
      history.push("/daily");
    } catch (error) {
      setLoading(false);
      setAlertMessage(error.message);
      setOpenAlertModal(true);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    let provider = new firebase.auth.GoogleAuthProvider();
    await firebaseApp
      .auth()
      .signInWithPopup(provider)
      .catch((error) => {
        setLoading(false);
        setAlertMessage(error.message);
        setOpenAlertModal(true);
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
    <div className="login">
      <Dialog
        open={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{alertMessage}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenAlertModal(false)} color="primary">
            Fine..
          </Button>
        </DialogActions>
      </Dialog>
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
  ) : (
    <Loading />
  );
}

export default Login;
