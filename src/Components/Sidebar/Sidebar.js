import React, { useEffect } from "react";
import "./Sidebar.css";
import dailyIcon from "../../images/dailyIcon.svg";
import weekIcon from "../../images/weekIcon.svg";
import monthIcon from "../../images/monthIcon.svg";
import yearIcon from "../../images/yearIcon.svg";
import longTermIcon from "../../images/longTermIcon.svg";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";

function Sidebar() {
  function changeColor() {
    let currentLink = window.location.pathname.split("/")[1];
    //window.location gives the link after main link(localhost or netlify url)
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
      <Link to="/daily" title="Daily Goals">
        <img src={dailyIcon} className="daily sidebarIcon" />
      </Link>
      <Link to="/week" title="Weekly Goals">
        <img src={weekIcon} className="week sidebarIcon" />
      </Link>
      <Link to="/month" title="Monthly Goals">
        <img src={monthIcon} className="month sidebarIcon" />
      </Link>
      <Link to="/year" title="Yearly Goals">
        <img src={yearIcon} className="year sidebarIcon" />
      </Link>
      <Link to="/longTerm" title="Long Term Goals">
        <img src={longTermIcon} className="longTerm sidebarIcon" />
      </Link>
    </div>
  );
}

export default Sidebar;
