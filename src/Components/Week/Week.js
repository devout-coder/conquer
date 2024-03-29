import React from "react";
import { useHistory } from "react-router-dom";
import IncompleteTodosSidebar from "../IncompleteTodosSidebar/IncompleteTodosSidebar";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import WeekCalendar from "../WeekCalendar/WeekCalendar";
import "./Week.css";
function Week() {
  return (
    <div className="week">
      <Navbar />
      <div className="weekPage">
        <Sidebar />
        <div className="weekPageEmpty">
          <WeekCalendar />
          <IncompleteTodosSidebar timeType="week" />
        </div>
      </div>
    </div>
  );
}

export default Week;
