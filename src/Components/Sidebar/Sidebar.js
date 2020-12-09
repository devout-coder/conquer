import React, { useEffect } from "react";
import "./Sidebar.css";
import notesIcon from "../../images/notesIcon.svg";
import dailyIcon from "../../images/dailyIcon.svg";
import weekIcon from "../../images/weekIcon.svg";
import monthIcon from "../../images/monthIcon.svg";
import yearIcon from "../../images/yearIcon.svg";
import longTermIcon from "../../images/longTermIcon.svg";
import visionBoardIcon from "../../images/visionBoardIcon.svg";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";

function Sidebar() {
  function changeColor() {
    let currentLink = window.location.pathname.split("/")[1];
    let reqElement = document.getElementsByClassName(
      `sidebarIcon ${currentLink}`
    )[0];
    reqElement.classList.add("colorMe");
  }
  useEffect(() => {
    changeColor();
  }, []);
  return (
    <div className="sidebar">
      <Link to="/notes" title="Notes" >
        <img src={notesIcon} className="notes sidebarIcon" />
      </Link>
      <Link to="/daily" title="Daily Goals" >
        <img src={dailyIcon} className="daily sidebarIcon" />
      </Link>
      <Link to="/week" title="Weekly Goals" >
        <img src={weekIcon} className="week sidebarIcon" />
      </Link>
      <Link to="/month" title="Monthly Goals" >
        <img src={monthIcon} className="month sidebarIcon" />
      </Link>
      <Link to="/year" title="Yearly Goals" >
        <img src={yearIcon} className="year sidebarIcon" />
      </Link>
      <Link to="/longTerm" title="Long Term Goals" >
        <img src={longTermIcon} className="longTerm sidebarIcon" />
      </Link>
      <Link to="/visionBoard" title="Vision Board" >
        <img src={visionBoardIcon} className="visionBoard sidebarIcon" />
      </Link>
    </div>
  );
}

export default Sidebar;
