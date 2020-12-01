import React, { useEffect, useState } from "react";
import "./Calendar.css";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { IconButton } from "@material-ui/core";

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };
  const getDaysIn = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const days = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
  const getReqCols = () => {
    let noPrevDays = new Date(currentYear, currentMonth, 1).getDay() - 1;
    noPrevDays = noPrevDays === -1 ? 6 : noPrevDays;
    let noNextDays =
      7 -
      new Date(
        currentYear,
        currentMonth,
        getDaysIn(currentYear, currentMonth)
      ).getDay();
    noNextDays = noNextDays === 7 ? 0 : noNextDays;
    let prevDays = [
      ...Array(getDaysIn(currentYear, currentMonth - 1)).keys(),
    ].map((x) => x + 1);
    prevDays =
      noPrevDays != 0 ? prevDays.slice(-noPrevDays, prevDays.length + 1) : [];
    let nextDays = [
      ...Array(getDaysIn(currentYear, currentMonth + 1)).keys(),
    ].map((x) => x + 1);
    nextDays = nextDays.slice(0, noNextDays);
    let currentDays = [
      ...Array(getDaysIn(currentYear, currentMonth)).keys(),
    ].map((x) => x + 1);
    let allDays = [...prevDays, ...currentDays, ...nextDays];
    let horizontalList = [];
    let i = 0;
    while (i < allDays.length) {
      horizontalList.push(allDays.slice(i, i + 7));
      i = i + 7;
    }
    let megaArr = [];
    for (let i = 0; i < 7; i++) {
      let miniArr = [];
      for (let each of horizontalList) {
        miniArr.push(each[i]);
      }
      miniArr.unshift(days[i]);
      megaArr.push(miniArr);
    }
    return megaArr;
  };

  const increaseMonth = () => {
    if (currentMonth + 1 <= 11) {
      setCurrentMonth(currentMonth + 1);
    } else {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    }
  };

  const decreaseMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1);
    } else {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    }
  };
  return (
    <div className="calendar">
      <div className="topbar">
        <IconButton color="secondary" onClick={() => decreaseMonth()}>
          <ArrowLeftIcon />
        </IconButton>
        <span className="topbarMonth">
          {months[currentMonth]}&nbsp;{currentYear}
        </span>
        <IconButton color="primary" onClick={() => increaseMonth()}>
          <ArrowRightIcon />
        </IconButton>
      </div>
      <table></table>
      {/* <div className="monthbar">
        <span className="day">Mon</span>
        <span className="day">Tue</span>
        <span className="day">Wed</span>
        <span className="day">Thurs</span>
        <span className="day">Fri</span>
        <span className="day">Sat</span>
        <span className="day">Sun</span>
      </div> */}
      <div className="allDates">
        {getReqCols().map((col) => (
          <div className="datesColumn">
            {col.map((date) => (
              <div className="individual">{date}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
