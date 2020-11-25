import React from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Landing.css";

function Landing() {
  let history = useHistory()
  return (
    <div className="landing">
      <Navbar />
      <div className="landingContent">
        <p className="landingPara landingPara1">
          We believe you can conquer all your goals..
        </p>
        <p className="landingPara landingPara2">
          Our mission is to provide you an awesome tool to plan your journey
        </p>
        <button className="getStartedButt" onClick={()=>history.push('/signup')}  >Get Started</button>
      </div>
    </div>
  );
}

export default Landing;
