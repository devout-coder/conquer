import React, { useState } from "react";
import "./YearPicker.css";
import { FormControl, MenuItem, Select } from "@material-ui/core";

function YearPicker(props) {
  function getYears() {
    //returns an array which has years from 2020 to 2100
    let allYears = [];
    let initialYear = 2020;
    while (initialYear <= 2100) {
      allYears.push(initialYear);
      initialYear++;
    }
    return allYears;
  }
  return (
    <div className="yearPicker">
      <FormControl>
        <Select
          value={props.year}
          onChange={(e) => props.changeYear(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {getYears().map((year) => (
            <MenuItem value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default YearPicker;
