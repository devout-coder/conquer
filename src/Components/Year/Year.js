import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Year.css";
function Year() {
  let history = useHistory();
  const year = useLocation().state;
  //if an year in incomplete todos sidebar is clicked then the specific year is passed in the object state...but if the year is just rendered and no specfic year is clicked then this will be undefined
  
  history.push({
    pathname: "/year/allTodos",
    state: {
      time: year != undefined ? year.time : new Date().getFullYear(),
      timeType: "year",
    },
  });
  return <div></div>;
}

export default Year;
