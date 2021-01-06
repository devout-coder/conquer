import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Notes.css";

function Notes() {
  return (
    <div className="notes">
      <Navbar />
      <div className="notesPage">
        {/* this dailyPage class encloses the part of the page below the navbar */}
        <Sidebar />
        <div className="notesPageEmpty">
          {/* this  dailyPageEmpty class encloses the part of the page below the navbar and to the right of the sidebar */}
          <span id="notYetCompleteMessage">This feature is to be added soon...</span>
        </div>
      </div>
    </div>
  );
}

export default Notes;
