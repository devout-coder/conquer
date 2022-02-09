import React, { useContext, useEffect, useState } from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { IconButton } from "@material-ui/core";
import "./Calendar.css";
import { loadingContext } from "../../loadingContext";
import { useHistory } from "react-router-dom";

export const months = {
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

function Calendar() {
  const isLoading = useContext(loadingContext);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const history = useHistory();
  const getDaysIn = (year, month) => {
    //this function returns the no of days in a particular month
    return new Date(year, month + 1, 0).getDate();
  };
  function formattedDate(date) {
    //this function returns any specific date in the format i want which is dd/mm/yyyy
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${day}/${month + 1}/${year}`;
  }
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const getReqRows = () => {
    //this function returns a giant list which contains several lists with each list representing a week in the month and having all dates in that week
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
        prevDays[index] = `${prevDays[index]}/${currentMonth}/${currentYear}`;
      } else {
        prevDays[index] = `${prevDays[index]}/12/${currentYear - 1}`;
      }
    });
    //var prevDays contains all dates which are in previous month but are present in the first week of this month

    let nextDays = [
      ...Array(getDaysIn(currentYear, currentMonth + 1)).keys(),
    ].map((x) => x + 1);
    nextDays = nextDays.slice(0, noNextDays);
    nextDays.forEach((name, index) => {
      if (currentMonth + 1 <= 11) {
        nextDays[index] = `${nextDays[index]}/${
          currentMonth + 2
        }/${currentYear}`;
      } else {
        nextDays[index] = `${nextDays[index]}/1/${currentYear + 1}`;
      }
    });
    //var nextDays contains all dates which are in next month but are present in the last week of this month

    let currentDays = [
      ...Array(getDaysIn(currentYear, currentMonth)).keys(),
    ].map((x) => x + 1);
    currentDays.forEach((name, index) => {
      currentDays[index] = `${currentDays[index]}/${
        currentMonth + 1
      }/${currentYear}`;
    });
    //var currentDays holds all the dates which are present in this month

    let allDays = [...prevDays, ...currentDays, ...nextDays];
    //allDays holds all dates in all weeks of current month

    let horizontalList = [];
    let i = 0;
    while (i < allDays.length) {
      //every 7 elements in allDays r pushed as a separate list(which represents a week) in horizontalList
      horizontalList.push(allDays.slice(i, i + 7));
      i = i + 7;
    }
    return horizontalList;
  };

  function changeId() {
    //this function changes the id of td which contains today's date to today and those which contain dates of not this month to notThisMonth...cause i ve defined separate css for these classes

    let allDates = document.getElementsByTagName("td"); //gets all td elements which hold all dates of all the weeks in the currentMonth
    let todayDate = formattedDate(new Date()); //gets today's date in format of dd/mm/yyyy
    let today = document.getElementById(todayDate); //gets the element in html whose id matches today's date
    if (today != null) {
      today.id = "today"; //sets today as id of element with today's date as prev id
    } else {
    }
    for (let each of allDates) {
      //this loop goes through all elements in allDays, splits the id of every element and checks if the month is the current month or not..if its not the current month then the id is changed to notThisMonth
      if (each.id.split("/")[1] != currentMonth + 1 && each.id != "today") {
        each.id = "notThisMonth";
      }
    }
  }
  useEffect(() => {
    changeId();
  }, [isLoading, currentMonth]);
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
  return (
    <div className="calendar">
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
      <table>
        <tr>
          {weekDays.map((day) => (
            <th className="day">{day}</th>
          ))}
        </tr>
        {getReqRows().map((row) => (
          <tr className="row">
            {/* each list in getReqRows is used as a row here */}
            {row.map((date) => (
              // each date in the list is used as id to td
              <td id={date}>
                <IconButton
                  size="medium"
                  color="primary"
                  onClick={() =>
                    history.push({
                      pathname: "daily/allTodos",
                      state: { time: date, timeType: "daily" },
                    })
                  }
                >
                  {
                    //the day part of the date is used here..
                    date.split("/")[0]
                  }
                </IconButton>
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default Calendar;
