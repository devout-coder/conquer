import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import IncompleteTodosSidebar from "../IncompleteTodosSidebar/IncompleteTodosSidebar";
import MonthCalendar from "../MonthCalendar/MonthCalendar";
import "./Month.css";

function Month() {
  return (
    <div className="month">
      <Navbar />
      <div className="monthPage">
        <Sidebar />
        <div className="monthPageEmpty">
          <MonthCalendar/>
          <IncompleteTodosSidebar timeType="month" />
        </div>
      </div>
    </div>
  );
}

export default Month;
