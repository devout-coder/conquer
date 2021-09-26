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
          Introducing the best way to plan your goals...
        </p>
        <button className="getStartedButt" onClick={()=>history.push('/signup')}  >Get Started</button>
      </div>
    </div>
  );
}

export default Landing;
