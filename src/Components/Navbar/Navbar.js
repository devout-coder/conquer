import React, { useContext } from "react";
import "./Navbar.css";
import logo from "../../images/conquerLogo.svg";
import { Link } from "react-router-dom";
import { loadingContext } from "../../loadingContext";
import firebaseApp from "../../firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IconButton } from "@material-ui/core";
import { People } from "@material-ui/icons";

function Navbar() {
  const user = useContext(loadingContext);
  return (
    <div className="navbar">
      <div className="navbarLeft">
        <img src={logo} className="conquerLogo" alt="" />
        <Link to="/" className="conquerText">
          Conquer
        </Link>
      </div>
      {user == null || user == false ? (
        <span></span>
      ) : (
        <div class="navbarRight">
          <IconButton
            onClick={() => firebaseApp.auth().signOut()}
            title="Logout"
          >
            <ExitToAppIcon className="logoutIcon" />
          </IconButton>
          <Link to="/friends">
            <IconButton>
              <People className="peopleIcon" />
            </IconButton>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
