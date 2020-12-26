import { Button } from "@material-ui/core";
import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import YearPicker from "../YearPicker/YearPicker";
import "./Month.css";
import { months as singleListMonths } from "../Calendar/Calendar";
import { useHistory } from "react-router-dom";

function Month() {
  let history = useHistory();
  const [year, setYear] = useState(new Date().getFullYear());
  const months = [
    ["January", "February", "March", "April", "May", "June"],
    ["July", "August", "September", "October", "November", "December"],
  ]; //since i want to want to make 2 columns of months and css grids suck😣😣so i have made 2 separate lists of months into a mega list...so i put both of them in 2 separate divs(which obviously have flex-direction column) and give their parent flex direction row...

  return (
    <div className="month">
      <Navbar />
      <div className="monthPage">
        <Sidebar />
        <div className="monthPageEmpty">
          <YearPicker year={year} changeYear={(year) => setYear(year)} />
          <div className="allMonths">
            {months.map((monthset) => (
              <div className="monthsColumn">
                {monthset.map((month) => (
                  <Button
                    className={
                      new Date().getFullYear() == year &&
                      singleListMonths[new Date().getMonth()] == month
                        ? "displayMonth currentMonth"
                        : "displayMonth"
                    }
                    onClick={() =>
                      history.push({
                        pathname: "month/allTodos",
                        state: {
                          time: `${month} ${year.toString()}`,
                          lastPage: "month",
                        },
                      })
                    }
                  >
                    {month}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Month;
