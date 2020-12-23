import React from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Year.css";
function Year() {
  let history = useHistory();
  history.push({
    pathname: "/year/allTodos",
    state: { time: new Date().getFullYear(), lastPage: "year" },
  });
  return <div></div>;
}

export default Year;
