import React from 'react'
import './Navbar.css'
import logo from '../../images/conquerLogo.svg'

function Navbar() {
    return (
        <div className="navbar" >
            <img src={logo} className="conquerLogo"  alt=""/>
            <span className="conquerText" >Conquer</span>
        </div>
    )
}

export default Navbar
