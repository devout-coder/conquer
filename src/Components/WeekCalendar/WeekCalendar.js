import { Button, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import "./WeekCalendar.css";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { useHistory } from "react-router-dom";
import { months } from "../Calendar/Calendar";

function WeekCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const history = useHistory();
  const weekMonths = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug",
    8: "Sept",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  }; //these r the months for the topbar

  const getWeekFormattedDate = (date) => {
    //this converts the date to the format dd M yyyy
    return `${date.getDate()} ${
      weekMonths[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  function replaceDate(date) {
    //this function removes space and year from the date
    return date.replace(/\s\d{4}/g, "");
  }

  const getDaysIn = (year, month) => {
    //this function returns the no of days in a particular month
    return new Date(year, month + 1, 0).getDate();
  };

  const increaseMonth = () => {
    //this function increases the month and changes the month to jan of next year if the existing month is december
    if (currentMonth + 1 <= 11) {
      setCurrentMonth(currentMonth + 1);
    } else {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    }
  };

  const decreaseMonth = () => {
    //this function decreases the month and changes the month to december of previous year if the existing month is jan
    if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1);
    } else {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    }
  };

  const getWeeks = () => {
    //this function returns all the weeks in the current month

    let noPrevDays = new Date(currentYear, currentMonth, 1).getDay() - 1;
    noPrevDays = noPrevDays === -1 ? 6 : noPrevDays;
    //this var holds the value of no of days in previous month which appear in the first week of this month

    let noNextDays =
      7 -
      new Date(
        currentYear,
        currentMonth,
        getDaysIn(currentYear, currentMonth)
      ).getDay();
    noNextDays = noNextDays === 7 ? 0 : noNextDays;
    //this var holds the value of no of days in next month which appear in the last week of this month

    let prevDays = [
      ...Array(getDaysIn(currentYear, currentMonth - 1)).keys(),
    ].map((x) => x + 1);
    prevDays =
      noPrevDays != 0 ? prevDays.slice(-noPrevDays, prevDays.length + 1) : [];
    prevDays.forEach((name, index) => {
      if (currentMonth > 0) {
        prevDays[index] = `${prevDays[index]} ${
          weekMonths[currentMonth - 1]
        } ${currentYear}`;
      } else {
        prevDays[index] = `${prevDays[index]} Dec ${currentYear - 1}`;
      }
    });
    //var prevDays contains all dates which are in previous month but are present in the first week of this month

    let nextDays = [
      ...Array(getDaysIn(currentYear, currentMonth + 1)).keys(),
    ].map((x) => x + 1);
    nextDays = nextDays.slice(0, noNextDays);
    nextDays.forEach((name, index) => {
      if (currentMonth + 1 <= 11) {
        nextDays[index] = `${nextDays[index]} ${
          weekMonths[currentMonth + 1]
        } ${currentYear}`;
      } else {
        nextDays[index] = `${nextDays[index]} Jan ${currentYear + 1}`;
      }
    });
    //var nextDays contains all dates which are in next month but are present in the last week of this month

    let currentDays = [
      ...Array(getDaysIn(currentYear, currentMonth)).keys(),
    ].map((x) => x + 1);
    currentDays.forEach((name, index) => {
      currentDays[
        index
      ] = `${currentDays[index]} ${weekMonths[currentMonth]} ${currentYear}`;
    });
    //var currentDays holds all the dates which are present in this month

    let allDays = [...prevDays, ...currentDays, ...nextDays];
    //allDays holds all dates in all weeks of current month

    let weeksList = [];
    let today = getWeekFormattedDate(new Date());
    for (let i; i < allDays.length; i = i + 7) {
      //loops through a week
      let foundToday = false;
      for (let each of allDays.slice(i, i + 7)) {
        //this loops through all days in this particular week
        if (each == today) {
          //when any day matches with today's date then the foundToday switch is turned true for this week
          foundToday = true;
        }
      }
      weeksList.push(
        foundToday
          ? `${allDays[i]}-${allDays[i + 6]}#currentWeek`
          : `${allDays[i]}-${allDays[i + 6]}`
        //if today's date lies in this week then foundToday ll be true and then the week ll be labelled as #currentWeek
      );
      foundToday = false; //foundToday is turned false before running the while loop for next week
    }
    return weeksList;
  };

  return (
    <div className="weekCalendar">
      <div className="topbar">
        <IconButton color="secondary" onClick={() => decreaseMonth()}>
          <ArrowLeftIcon />
        </IconButton>
        <span className="topbarMonth">
          {months[currentMonth]}&nbsp;{currentYear}
        </span>
        <IconButton color="secondary" onClick={() => increaseMonth()}>
          <ArrowRightIcon />
        </IconButton>
      </div>
      <div className="allWeeks">
        {getWeeks().map((week) => (
          <Button
            className={
              week.split("#")[1] == "currentWeek"
                ? "eachWeek currentWeek"
                : "eachWeek"
            }
            onClick={() =>
              history.push({
                pathname: "week/allTodos",
                state: { time: week.split("#")[0], lastPage: "week" },
              })
            }
          >
            {replaceDate(week.split("#")[0])}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default WeekCalendar;
