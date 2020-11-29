import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./Notes.css";

function Notes() {
  return (
    <div className="notes">
      <Navbar />
      <Sidebar />
    </div>
  );
}

export default Notes;
