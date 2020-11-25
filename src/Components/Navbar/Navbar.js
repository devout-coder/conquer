import React from 'react'
import './Navbar.css'
import logo from '../../images/conquerLogo.svg'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <div className="navbar" >
            <img src={logo} className="conquerLogo"  alt=""/>
            <Link to="/" className="conquerText" >Conquer</Link>
        </div>
    )
}

export default Navbar
