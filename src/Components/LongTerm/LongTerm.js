import React from "react";
import { useHistory } from "react-router-dom";
import AllTodos from "../AllTodos/AllTodos";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./LongTerm.css";

function LongTerm() {
  let history = useHistory()
  history.push({
    pathname: "/longTerm/allTodos",
    state: { time: "Long Term Goals🎯🎯", lastPage: "daily" },
  })
  return(
    <div></div>
  )
}

export default LongTerm;
