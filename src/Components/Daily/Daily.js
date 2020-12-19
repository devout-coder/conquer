import React from "react";
import Navbar from "../Navbar/Navbar";
import "./Daily.css";
import Sidebar from "../Sidebar/Sidebar";
import Calendar from "../Calendar/Calendar";

function Daily() {
  return (
    <div className="daily">
      {/* this daily class encloses the entire page with navbar at its top */}
      <Navbar />
      <div className="dailyPage">
        {/* this dailyPage class encloses the part of the page below the navbar */}
        <Sidebar />
        <div className="dailyPageEmpty">
          {/* this  dailyPageEmpty class encloses the part of the page below the navbar and to the right of the sidebar */}
          <Calendar/>
        </div>
      </div>
    </div>
  );
}

export default Daily;
