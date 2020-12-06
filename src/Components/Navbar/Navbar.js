import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../images/conquerLogo.svg'
import { Link } from 'react-router-dom'
import { loadingContext } from '../../loadingContext';
import firebaseApp from '../../firebase';

function Navbar() {
    const firebaseInitialized = useContext(loadingContext);
    return (
        <div className="navbar" >
            <img src={logo} className="conquerLogo"  alt=""/>
            <Link to="/" className="conquerText" >Conquer</Link>
            {firebaseInitialized?(
                <span className="logoutText" onClick={()=>firebaseApp.auth().signOut()} >Logout</span>
            ):(
                <span></span>
            )}
            
        </div>
    )
}

export default Navbar
