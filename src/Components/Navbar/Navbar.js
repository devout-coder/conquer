import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../images/conquerLogo.svg'
import { Link } from 'react-router-dom'
import { loadingContext } from '../../loadingContext';
import firebaseApp from '../../firebase';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { IconButton } from '@material-ui/core';

function Navbar() {
    const firebaseInitialized = useContext(loadingContext);
    return (
        <div className="navbar" >
            <img src={logo} className="conquerLogo"  alt=""/>
            <Link to="/" className="conquerText" >Conquer</Link>
            {firebaseInitialized?(
                <IconButton onClick={()=>firebaseApp.auth().signOut()} title="Logout" >
                    <ExitToAppIcon className="logoutText" />
                </IconButton>
            ):(
                <span></span>
            )}
            
        </div>
    )
}

export default Navbar
