import React, { useState } from "react";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import { ArrowBack, Save } from "@material-ui/icons";
import {
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
} from "@material-ui/core";
import "./NewTodoModal.css";
import firebaseApp from "../../firebase";
import { useEffect } from "react";
import { useRef } from "react";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { months } from "../Calendar/Calendar";
import { fullMonths } from "../IncompleteTodosSidebar/IncompleteTodosSidebar";
import { weekMonths } from "../WeekCalendar/WeekCalendar";

function NewTodoModal(props) {
  // console.log(props.time);
  // console.log(props.timeType);
  // console.log(props.timesPostponed);

  const [taskPri, setTaskPri] = useState(props.taskPri);
  const [taskName, setTaskName] = useState(props.taskName);
  const [taskDesc, setTaskDesc] = useState(props.taskDesc);
  const [taskId, setTaskId] = useState(props.taskId);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [priChanged, setPriChanged] = useState(false);
  const initialRender = useRef(true);
  //useRef is used to store data which doesn't change even on re-render

  function slideback() {
    //this new class removeModal will be added which has a cool slideback animation attached to it
    document.getElementsByClassName("modal")[0].classList.add("removeModal");
    setTimeout(() => {
      props.openTodoModal(false);
    }, 800);
  }

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      //once its set false even though the component re-renders its value be false
    } else {
      setPriChanged(true);
    }
  }, [taskPri]);

  function postponeText() {
    let times =
      props.timesPostponed == 1 ? "1 time" : `${props.timesPostponed} times`;
    return `postponed ${times}...`;
  }

  const [loadedTodos, setLoadedTodos] = useState(null);
  function loadUnfinishedTodos() {
    firebaseApp
      .firestore()
      .collection("todos")
      .where("user", "==", firebaseApp.auth().currentUser.uid)
      .where("time", "==", props.time)
      .orderBy("index", "asc")
      .get()
      .then((snap) => {
        let all = [];
        snap.docs.map((each) => {
          let eachdict = {
            id: each.id,
            taskName: each.get("taskName"),
            taskDesc: each.get("taskDesc"),
            priority: each.get("priority"),
            finished: each.get("finished"),
            time: each.get("time"),
            index: each.get("index"),
            timeType: each.get("timeType"),
            timesPostponed: each.get("timesPostponed"),
          };
          all.push(eachdict);
        });
        setLoadedTodos(all);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const [futureTodos, setFutureTodos] = useState([]);

  function loadFutureTodos() {
    if (props.timeType != "longTerm") {
      firebaseApp
        .firestore()
        .collection("todos")
        .where("user", "==", firebaseApp.auth().currentUser.uid)
        .where("time", "==", nextTime())
        .orderBy("priority", "desc")
        .get()
        .then((snap) => {
          let futureTodos = [];
          snap.docs.map((each) => {
            let eachdict = {
              id: each.id,
              taskName: each.get("taskName"),
              taskDesc: each.get("taskDesc"),
              priority: each.get("priority"),
              finished: each.get("finished"),
              time: each.get("time"),
              index: each.get("index"),
              timeType: each.get("timeType"),
              timesPostponed: each.get("timesPostponed"),
            };
            futureTodos.push(eachdict);
          });
          setFutureTodos(futureTodos);
        });
    }
  }

  function reverseObject(object) {
    let tempObj = {};
    for (let key in object) {
      tempObj[object[key]] = key;
    }
    return tempObj;
  }

  function nextTime() {
    if (props.timeType == "year") {
      return parseInt(props.time) + 1;
    } else if (props.timeType == "month") {
      let month = props.time.split(" ")[0];
      let year = props.time.split(" ")[1];
      if (month == "December") {
        let nextYear = parseInt(year) + 1;
        return "January " + nextYear.toString();
      } else {
        return months[fullMonths.indexOf(month) + 1] + " " + year;
      }
    } else if (props.timeType == "week") {
      let lastDay = props.time.split("-")[1];
      let [day, month, year] = lastDay.split(" ");
      month = parseInt(reverseObject(weekMonths)[month]) + 1;
      month = month.toString();
      if (day.length == 1) {
        day = "0" + day;
      }
      if (month.length == 1) {
        month = "0" + month;
      }
      let thisDay = new Date(`${year}-${month}-${day}`);
      let nextDay = new Date(thisDay);
      nextDay.setDate(thisDay.getDate() + 1);
      let newLastDay = new Date(thisDay);
      newLastDay.setDate(thisDay.getDate() + 7);
      return `${nextDay.getDate()} ${
        weekMonths[nextDay.getMonth()]
      } ${nextDay.getFullYear()}-${newLastDay.getDate()} ${
        weekMonths[newLastDay.getMonth()]
      } ${newLastDay.getFullYear()}`;
    } else if (props.timeType == "daily") {
      let [day, month, year] = props.time.split("/");
      if (day.length == 1) {
        day = "0" + day;
      }
      if (month.length == 1) {
        month = "0" + month;
      }
      let thisDay = new Date(`${year}-${month}-${day}`);
      let nextDay = new Date(thisDay);
      nextDay.setDate(thisDay.getDate() + 1);
      day = nextDay.getDate();
      month = parseInt(nextDay.getMonth()) + 1;
      year = nextDay.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  useEffect(() => {
    loadFutureTodos();
    if (props.unfinishedTodos == undefined) {
      loadUnfinishedTodos();
    }
  }, []);

  function priPosition(todos) {
    //this function computes the appropriate position for any new todo of each priority
    //it returns an array something like this [[3,1], [2, 4], [1, 8], [0, 10]]
    //it means the  array has 1 todo already exisiting at 0 position so appropriate position for new element of priority 3 is 1 and so on

    let reqPos = [];
    for (let i = 3; i >= 0; i--) {
      if (todos.length != 0) {
        for (let index = 0; index < todos.length; index++) {
          if (i > todos[index].priority) {
            reqPos.push([i, index]);
            break;
          } else if (index == todos.length - 1) {
            reqPos.push([i, todos.length]);
          }
        }
      } else {
        reqPos.push([i, 0]);
      }
    }
    return reqPos;
  }

  function decidePosition(todos, priority) {
    //this function takes a priority and returns the sutiable index for a new element of that priority
    let reqIndex;
    priPosition(todos).forEach((each) => {
      if (priority == each[0]) {
        reqIndex = each[1];
      }
    });
    return reqIndex;
  }

  function newTodoManagePri(newIndex) {
    // it increases the index of all todos which have index value equal to or more than newIndex
    props.unfinishedTodos.forEach((each, index) => {
      if (index >= newIndex) {
        firebaseApp
          .firestore()
          .collection("todos")
          .doc(each.id)
          .update({
            index: index + 1,
          });
      }
    });
  }

  function existingTodoChangePri() {
    //this changes the priority of all todos in between the todo and its new position

    let todos =
      props.unfinishedTodos != undefined ? props.unfinishedTodos : loadedTodos;
    let initialPos = props.taskIndex;
    let finalPos = decidePosition(props.unfinishedTodos, taskPri);
    if (initialPos < finalPos) {
      todos.forEach((each, index) => {
        if (index > initialPos && index < finalPos) {
          // this reduces index of all items in between initial and final position by 1
          firebaseApp
            .firestore()
            .collection("todos")
            .doc(each.id)
            .update({
              index: index - 1,
            });
        }
      });
    } else if (initialPos > finalPos) {
      // this increases index of all items in between initial and final position by 1
      todos.forEach((each, index) => {
        if (index < initialPos && index >= finalPos) {
          firebaseApp
            .firestore()
            .collection("todos")
            .doc(each.id)
            .update({
              index: index + 1,
            });
        }
      });
    }
  }

  function updateFutureAndPresentTodosIndex(
    presentTodos,
    futureTodos,
    newIndex
  ) {
    futureTodos.forEach((each) => {
      if (each.index >= newIndex) {
        firebaseApp
          .firestore()
          .collection("todos")
          .doc(each.id)
          .update({
            index: each.index + 1,
          })
          .catch((error) => console.log(error));
      }
    });
    presentTodos.forEach((each) => {
      if (each.index >= props.taskIndex) {
        firebaseApp
          .firestore()
          .collection("todos")
          .doc(each.id)
          .update({
            index: each.index - 1,
          })
          .catch((error) => console.log(error));
      }
    });
  }

  function postponeTodo() {
    let presentTodos =
      props.unfinishedTodos != undefined ? props.unfinishedTodos : loadedTodos;
    let newIndex = decidePosition(futureTodos, props.taskPri);
    updateFutureAndPresentTodosIndex(presentTodos, futureTodos, newIndex);
    firebaseApp
      .firestore()
      .collection("todos")
      .doc(props.taskId)
      .update({
        time: nextTime(),
        index: newIndex,
        timesPostponed:
          props.timesPostponed != undefined ? props.timesPostponed + 1 : 1,
      })
      .then(() => {
        props.shouldReload();
        slideback();
      });
  }

  function saveTodo() {
    if (props.taskId === "") {
      //makes a new todo if the id prop is empty str which means that no particular todo is opened
      let newIndex = decidePosition(props.unfinishedTodos, taskPri);
      newTodoManagePri(newIndex);
      let todo = {
        taskName: taskName,
        taskDesc: taskDesc,
        time: props.time,
        timeType: props.timeType,
        priority: taskPri,
        user: firebaseApp.auth().currentUser.uid,
        finished: false,
        index: newIndex,
      };
      firebaseApp.firestore().collection("todos").add(todo);
    } else {
      //modifies the properties of original todo if some exisiting todo is opened in modal
      let todos =
        props.unfinishedTodos != undefined
          ? props.unfinishedTodos
          : loadedTodos;
      let newIndex = decidePosition(todos, taskPri);
      if (priChanged) {
        existingTodoChangePri();
      }
      firebaseApp
        .firestore()
        .collection("todos")
        .doc(taskId)
        .set(
          {
            taskName: taskName,
            taskDesc: taskDesc,
            priority: taskPri,
            index:
              //props.taskIndex is the inital position and newIndex gives the final position
              //!  DON'T TOUCH IT PLEASE this piece of code was absolutely mind fucking
              priChanged && props.taskIndex < newIndex
                ? newIndex - 1
                : priChanged && props.taskIndex > newIndex
                ? newIndex
                : props.taskIndex,
          },
          { merge: true }
        );
      setPriChanged(false);
    }
    props.shouldReload();
    slideback();
  }

  return (
    <div
      className="modalBackground"
      onClick={(e) => {
        try {
          if (!document.getElementsByClassName("modal")[0].contains(e.target)) {
            //this if statement checks if the click is inside the modal of not
            slideback();
          }
        } catch (error) {} //ve added a try catch statement cause it gives error when i open the priority list
      }}
      onKeyDown={(evt) => {
        //this function checks for keypresses..in case esc button is pressed modal is closed..if ctrl+s is pressed its saved
        if (evt.key == "Escape") {
          slideback();
        } else if (evt.key == "Control") {
          setCtrlPressed(true);
        } else if (evt.key == "s" && ctrlPressed) {
          setCtrlPressed(false);
          evt.preventDefault();
          saveTodo();
        }
      }}
      onKeyUp={(evt) => {
        if (evt.key == "Control") {
          setCtrlPressed(false);
        }
      }}
    >
      <div className="modal">
        <div className="modalTopbar">
          <input
            type="text"
            id="modalTaskName"
            placeholder="Task Name"
            spellCheck="false"
            value={taskName}
            autoComplete="off"
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <hr />
        <textarea
          spellCheck="false"
          id="modalTaskDesc"
          placeholder="Task Description"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
        ></textarea>
        <div id="modalBottomBar">
          {props.timesPostponed != undefined && props.taskId != "" ? (
            <span id="postponeText">{postponeText()}</span>
          ) : (
            <span></span>
          )}
          <div className="modalButtons">
            <FormControl>
              <Select
                value={taskPri}
                onChange={(e) => setTaskPri(e.target.value)}
                displayEmpty
              >
                <MenuItem value="3" className="eachPriority">
                  <PriorityHighIcon
                    id="highPriority"
                    style={{ color: "#FF3131" }}
                  ></PriorityHighIcon>
                  <span>High</span>
                </MenuItem>
                <MenuItem value="2" className="eachPriority">
                  <PriorityHighIcon
                    id="mediumPriority"
                    style={{ color: "#464D8E" }}
                  ></PriorityHighIcon>
                  <span>Medium</span>
                </MenuItem>
                <MenuItem value="1" className="eachPriority">
                  <PriorityHighIcon
                    id="lowPriority"
                    style={{ color: "#11B421" }}
                  ></PriorityHighIcon>
                  <span>Low</span>
                </MenuItem>
                <MenuItem value="0" className="eachPriority">
                  <PriorityHighIcon></PriorityHighIcon>
                  <span>No priority</span>
                </MenuItem>
              </Select>
              <FormHelperText>Priority</FormHelperText>
            </FormControl>
            <IconButton
              title="Back"
              id="modalBackButton"
              onClick={() => slideback()}
            >
              <ArrowBack />
            </IconButton>
            {props.timeType != "longTerm" &&
            !props.finished &&
            props.taskId != "" ? (
              <IconButton
                title="Postpone"
                id="modalPostponeButton"
                onClick={() => postponeTodo()}
              >
                <MdSubdirectoryArrowRight />
              </IconButton>
            ) : (
              <></>
            )}
            <IconButton
              title="Save"
              id="modalSaveButton"
              onClick={() => saveTodo()}
            >
              <Save />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTodoModal;
