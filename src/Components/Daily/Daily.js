import React from "react";
import Navbar from "../Navbar/Navbar";
import "./Daily.css";
import Sidebar from "../Sidebar/Sidebar";
import Calendar from "../Calendar/Calendar";
import addNotification from "react-push-notification";

function Daily() {
  addNotification({
    title: "Conquer",
    subtitle: "This is a subtitle",
    message: "This is a very long message",
    theme: "darkblue",
    native: true, // when using native, your OS will handle theming.
  });
  return (
    <div className="daily">
      {/* this daily class encloses the entire page with navbar at its top */}
      <Navbar />
      <div className="dailyPage">
        {/* this dailyPage class encloses the part of the page below the navbar */}
        <Sidebar />
        <div className="dailyPageEmpty">
          {/* this  dailyPageEmpty class encloses the part of the page below the navbar and to the right of the sidebar */}
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default Daily;
