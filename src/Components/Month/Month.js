import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import YearPicker from "../YearPicker/YearPicker";
import "./Month.css";

function Month() {
  const [year, setYear] = useState(new Date().getFullYear());
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="month">
      <Navbar />
      <div className="monthPage">
        <Sidebar />
        <div className="monthPageEmpty">
          <YearPicker year={year} changeYear={(year) => setYear(year)} />
        </div>
      </div>
    </div>
  );
}

export default Month;
