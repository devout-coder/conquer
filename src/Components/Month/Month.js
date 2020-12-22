import { FormControl, MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
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
  function getYears() {
    let allYears = [];
    let initialYear = 2020;
    while (initialYear <= 2100) {
      allYears.push(initialYear);
      initialYear++;
    }
    return allYears;
  }
  return (
    <div className="month">
      <Navbar />
      <div className="monthPage">
        <Sidebar />
        <div className="monthPageEmpty">
          <FormControl>
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {getYears().map((year) => (
                <MenuItem value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
}

export default Month;
