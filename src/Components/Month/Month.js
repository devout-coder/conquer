import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Month.css";

function Month() {
  return (
    <div className="month">
      <Navbar />
      <Sidebar />
    </div>
  );
}

export default Month;
