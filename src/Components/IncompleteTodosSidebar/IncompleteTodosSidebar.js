import React, { useContext, useEffect, useState } from "react";
import firebaseApp from "../../firebase";
import "./IncompleteTodosSidebar.css";
import Loading from "../Loading/Loading";
import EachTodo from "../EachTodo/EachTodo";
import NewTodoModal from "../NewTodoModal/NewTodoModal";
import { months } from "../Calendar/Calendar";
import { loadingContext } from "../../loadingContext";

export const fullMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function IncompleteTodosSidebar(props) {
  const weekMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [reqTodos, setReqTodos] = useState([]);
  const user = useContext(loadingContext);
  const [loading, setLoading] = useState(true);

  const [expandTask, setExpandTask] = useState(null);

  const [openTodoModal, setOpenTodoModal] = useState(false);
  //whenever this is true modal with required props is rendered

  function sortTodos(arr) {
    //later in func loadReqTodos i ve taken reqTodos as a parameter and sorts it by the time and in accordance of timeType(month, daily, week, year)
    let sortedTodos = arr;
    sortedTodos = arr.sort((a, b) => {
      return a.index - b.index;
    });
    sortedTodos = arr.sort((a, b) => {
      let temparr = [a.time, b.time];
      if (props.timeType == "year") {
        return temparr[1] - temparr[0];
      } else if (props.timeType == "month") {
        let newTemp = Array.from(
          temparr.map((each) => {
            return [fullMonths.indexOf(each.split(" ")[0]), each.split(" ")[1]];
          })
        ); //this is something like this [[0, 2021],[8, 2022]]
        let compareYear = newTemp[1][1] - newTemp[0][1]; //this contains the difference of years
        let compareMonth = newTemp[1][0] - newTemp[0][0]; //this contains the difference of months
        if (compareYear != 0) {
          //evaluates true if its not the same year
          return compareYear;
        } else {
          return compareMonth;
        }
      } else if (props.timeType == "week") {
        let newTemp = Array.from(
          temparr.map((each) => {
            let reqWeek = each.split("-")[0].split(" "); //this stores the first part of the week like ["4", "Jan", "2021"]
            reqWeek[1] = weekMonths.indexOf(reqWeek[1]); //replaces the name of the month to a no
            return reqWeek;
          })
        );
        let compareYear = newTemp[1][2] - newTemp[0][2]; //this contains the difference of years
        let compareMonth = newTemp[1][1] - newTemp[0][1]; //this contains the difference of months
        let compareDay = newTemp[1][0] - newTemp[0][0];
        if (compareYear != 0) {
          //evaluates true if its not the same year
          return compareYear;
        } else if (compareMonth != 0) {
          //evaluates true if its not the same month
          return compareMonth;
        } else {
          //evaluates true if its not the same day
          return compareDay;
        }
      } else if (props.timeType == "daily") {
        let newTemp = Array.from(
          temparr.map((each) => {
            let reqDay = each.split("/"); //this stores the first part of the week like ["4", "1", "2021"]
            return reqDay;
          })
        );
        let compareYear = newTemp[1][2] - newTemp[0][2]; //this contains the difference of years
        let compareMonth = newTemp[1][1] - newTemp[0][1]; //this contains the difference of months
        let compareDay = newTemp[1][0] - newTemp[0][0];
        if (compareYear != 0) {
          //evaluates true if its not the same year
          return compareYear;
        } else if (compareMonth != 0) {
          //evaluates true if its not the same month
          return compareMonth;
        } else {
          //evaluates true if its not the same day
          return compareDay;
        }
      }
    });
    return sortedTodos;
  }

  function loadReqTodos() {
    firebaseApp
      .firestore()
      .collection("todos")
      .where("users", "array-contains", user.uid)
      .where("timeType", "==", props.timeType)
      .orderBy("priority", "desc")
      // .orderBy("index", "asc")
      .onSnapshot((snap) => {
        setLoading(true);
        let tparray = [];
        snap.docs.map((each) => {
          let eachdict = {
            id: each.id,
            taskName: each.get("taskName"),
            taskDesc: each.get("taskDesc"),
            priority: each.get("priority"),
            finished: each.get("finished"),
            time: each.get("time"),
            timeType: each.get("timeType"),
            timesPostponed: each.get("timesPostponed"),
            index: each.get("index"),
            users: each.get("users"),
          };
          if (!each.get("finished")) {
            tparray.push(eachdict);
          }
        });
        sortTodos(tparray);
        setReqTodos(tparray);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (user) {
      loadReqTodos();
    } else {
      setLoading(true);
    }
  }, [user]);
  // console.log(reqTodos);

  return (
    <div
      className={
        reqTodos.length == 0
          ? "incompleteTodosSidebar emptySidebar"
          : "incompleteTodosSidebar"
      }
    >
      {openTodoModal ? (
        <NewTodoModal
          task={expandTask}
          shouldReload={() => console.log("nothing")}
          openTodoModal={(shouldOpen) => setOpenTodoModal(shouldOpen)}
        />
      ) : (
        <div></div>
      )}
      {loading ? (
        <Loading />
      ) : reqTodos.length == 0 ? (
        <div className="noTodosMessage">No incomplete tasks!</div>
      ) : (
        <div
          className={
            props.timeType == "year"
              ? "thisIsYear incompleteTodosCont"
              : "incompleteTodosCont"
          }
        >
          <div className="noIncompleteTodos">
            {reqTodos.length != 1
              ? `${reqTodos.length} incomplete tasks`
              : `${reqTodos.length} incomplete task`}
          </div>
          <div className="inCompleteTodos">
            {reqTodos.map((each) => (
              <EachTodo
                key={each.id}
                task={each}
                expandTodo={(task) => {
                  setExpandTask(task);
                  setOpenTodoModal(true);
                }}
                startLoading={() => loadReqTodos()}
                sidebarTodo={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default IncompleteTodosSidebar;
