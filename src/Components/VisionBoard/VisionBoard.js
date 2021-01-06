import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./VisionBoard.css";

function VisionBoard() {
  return (
    <div className="visionBoard">
      <Navbar />
      <div className="visionBoardPage">
        {/* this dailyPage class encloses the part of the page below the navbar */}
        <Sidebar />
        <div className="visionBoardPageEmpty">
          {/* this  dailyPageEmpty class encloses the part of the page below the navbar and to the right of the sidebar */}
          <span id="notYetCompleteMessage">
            This feature is to be added soon...
          </span>
        </div>
      </div>
    </div>
  );
}

export default VisionBoard;
