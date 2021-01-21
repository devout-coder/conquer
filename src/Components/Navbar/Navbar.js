import React, { useContext } from "react";
import "./Navbar.css";
import logo from "../../images/conquerLogo.svg";
import { Link } from "react-router-dom";
import { loadingContext } from "../../loadingContext";
import firebaseApp from "../../firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IconButton } from "@material-ui/core";

function Navbar() {
  const user = useContext(loadingContext);
  return (
    <div className="navbar">
      <img src={logo} className="conquerLogo" alt="" />
      <Link to="/" className="conquerText">
        Conquer
      </Link>
      {user == null || user == false ? (
        <span></span>
      ) : (
        <IconButton onClick={() => firebaseApp.auth().signOut()} title="Logout">
          <ExitToAppIcon className="logoutText" />
        </IconButton>
      )}
    </div>
  );
}

export default Navbar;
