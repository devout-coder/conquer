import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./VisionBoard.css";

function VisionBoard() {
  return (
    <div className="visionBoard">
      <Navbar />
      <Sidebar />
    </div>
  );
}

export default VisionBoard;
