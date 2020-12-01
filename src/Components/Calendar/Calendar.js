import React, { useState } from "react";
import "./Calendar.css";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { IconButton } from "@material-ui/core";

function Calendar() {
    const months = {
        0:"January",
        1:"February",
        2:"March",
        3:"April",
        4:"May",
        5:"June",
        6:"July",
        7:"August",
        8:"September",
        9:"October",
        10:"November",
        11:"December"
    }
    const getDaysIn = (month, year)=>{
      return new Date(year, month+1, 0).getDate()
    }
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const increaseMonth = ()=>{
        if (currentMonth + 1 <= 11){
            setCurrentMonth(currentMonth + 1)
        }else{
            setCurrentYear(currentYear + 1)
            setCurrentMonth(0)
        }
    }
    const decreaseMonth = ()=>{
        if (currentMonth > 0){
            setCurrentMonth(currentMonth - 1)
        }else{
            setCurrentYear(currentYear - 1)
            setCurrentMonth(11)
        }
    }
  return (
    <div className="calendar">
      <div className="topbar">
        <IconButton color="secondary" onClick = {()=> decreaseMonth()} >
          <ArrowLeftIcon />
        </IconButton>
        <span className="topbarMonth">{months[currentMonth]}&nbsp;{currentYear}</span>
        <IconButton color="primary" onClick = {()=> increaseMonth()} >
          <ArrowRightIcon />
        </IconButton>
      </div>
      <div className="monthbar">
        <span className="day">Mon</span>
        <span className="day">Tue</span>
        <span className="day">Wed</span>
        <span className="day">Thurs</span>
        <span className="day">Fri</span>
        <span className="day">Sat</span>
        <span className="day">Sun</span>
      </div>
    </div>
  );
}

export default Calendar;
