import React from "react";
import Navbar from "../Navbar/Navbar";
import "./Daily.css";
import Sidebar from "../Sidebar/Sidebar";
import Calendar from "../Calendar/Calendar";

function Daily() {
  return (
    <div className="daily">
      <Navbar />
      <div className="dailyPage">
        <Sidebar />
        <div className="dailyPageEmpty">
          <Calendar/>
        </div>
      </div>
    </div>
  );
}

export default Daily;
