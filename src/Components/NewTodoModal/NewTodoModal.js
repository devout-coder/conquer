import React, { useContext, useState } from "react";
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
import { loadingContext } from "../../loadingContext";

function NewTodoModal({ task, setTask, shouldReload, openTodoModal }) {
  // console.log(task.time);
  // console.log(task.timeType);
  // console.log(task.timesPostponed);
  // console.log(task.id);
  const user = useContext(loadingContext);
  const [taskPri, setTaskPri] = useState(
    task.id != undefined ? task.priority : "0"
  );
  const [taskName, setTaskName] = useState(
    task.id != undefined ? task.taskName : ""
  );
  const [taskDesc, setTaskDesc] = useState(
    task.id != undefined ? task.taskDesc : ""
  );
  const [taskId, setTaskId] = useState(task.id != undefined ? task.id : null);
  const [todoTaskOriginalUsers, setTodoTaskOriginalUsers] = useState(
    task.id != undefined ? task.users : [user.uid]
  );
  const [taskUsers, setTaskUsers] = useState(
    task.id != undefined ? task.users : [user.uid]
  );
  const [taskRemovedUsers, setTaskRemovedUsers] = useState([]);

  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [priChanged, setPriChanged] = useState(false);
  const initialRender = useRef(true);
  const initialRenderForTodos = useRef(true);
  //useRef is used to store data which doesn't change even on re-render

  const [reloadEverything, setReloadEverything] = useState(false);

  const [presentTodos, setPresentTodos] = useState({});
  const [futureTodos, setFutureTodos] = useState({});
  const [originalPresentTodos, setOriginalPresentTodos] = useState({});
  const [originalFutureTodos, setOriginalFutureTodos] = useState({});

  function loadTodosAllUsers(todosTime) {
    let dict = {};
    taskUsers.forEach((taskUser) => {
      firebaseApp
        .firestore()
        .collection("todos")
        .where("users", "array-contains", taskUser)
        .where("time", "==", todosTime)
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
              users: each.get("users"),
              index: each.get("index"),
              timeType: each.get("timeType"),
              timesPostponed: each.get("timesPostponed"),
            };
            all.push(eachdict);
          });
          dict[taskUser] = all.sort((a, b) => {
            return a.index[taskUser] - b.index[taskUser];
          });

          if (taskUsers.length == Object.keys(dict).length) {
            if (todosTime == task.time) {
              if (initialRenderForTodos.current) {
                setOriginalPresentTodos(dict);
              }
              setPresentTodos(dict);
            } else {
              if (initialRenderForTodos.current) {
                setOriginalFutureTodos(dict);
                initialRenderForTodos.current = false;
              }
              setFutureTodos(dict);
            }
          }
        });
    });
  }

  useEffect(() => {
    loadTodosAllUsers(task.time);
    if (task.timeType != "longTerm") {
      loadTodosAllUsers(nextTime());
    }
  }, [taskUsers, reloadEverything]);

  function slideback() {
    //this new class removeModal will be added which has a cool slideback animation attached to it
    document.getElementsByClassName("modal")[0].classList.add("removeModal");
    setTimeout(() => {
      setTask(null)
      openTodoModal(false);
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
      task.timesPostponed == 1 ? "1 time" : `${task.timesPostponed} times`;
    return `postponed ${times}...`;
  }

  function reverseObject(object) {
    let tempObj = {};
    for (let key in object) {
      tempObj[object[key]] = key;
    }
    return tempObj;
  }

  function nextTime() {
    if (task.timeType == "year") {
      return parseInt(task.time) + 1;
    } else if (task.timeType == "month") {
      let month = task.time.split(" ")[0];
      let year = task.time.split(" ")[1];
      if (month == "December") {
        let nextYear = parseInt(year) + 1;
        return "January " + nextYear.toString();
      } else {
        return months[fullMonths.indexOf(month) + 1] + " " + year;
      }
    } else if (task.timeType == "week") {
      let lastDay = task.time.split("-")[1];
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
    } else if (task.timeType == "daily") {
      let [day, month, year] = task.time.split("/");
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

  const alterIndex = (increaseOrDecrease, user, taskId, todos, setTodos) => {
    let allTodos = todos;
    for (let allTodosUser in allTodos) {
      let userTodos = allTodos[allTodosUser];
      userTodos = userTodos.map((eachTodo) => {
        if (eachTodo.id == taskId) {
          let tempInd = eachTodo.index;
          if (increaseOrDecrease == "increase") {
            tempInd[user] = tempInd[user] + 1;
          } else if (increaseOrDecrease == "decrease") {
            tempInd[user] = tempInd[user] - 1;
          }
          eachTodo.index = tempInd;
        }
        return eachTodo;
      });
      allTodos[allTodosUser] = userTodos;
    }
    setTodos(allTodos);
  };

  function newTodoManagePri(user, todos, newIndex) {
    // it increases the index of all todos which have index value equal to or more than newIndex

    todos.forEach((each) => {
      if (each.index[user] >= newIndex) {
        //if this task contains multiple users, do increment index for every user if the new task is added to that user as well

        let indexDict = each.index;
        // console.log(each.taskName, indexDict);
        indexDict[user] = indexDict[user] + 1;

        firebaseApp
          .firestore()
          .collection("todos")
          .doc(each.id)
          .update({
            index: indexDict,
          })
          .catch((error) => console.log(error));

        alterIndex("increase", user, each.id, presentTodos, setPresentTodos);
        alterIndex(
          "increase",
          user,
          each.id,
          originalPresentTodos,
          setOriginalPresentTodos
        );
      }
    });
  }

  function existingTodoPriChanged(user, todos) {
    //this changes the index of all todos in between the todo and its new position

    let initialPos = task.index[user];
    let finalPos = decidePosition(todos, taskPri);
    if (initialPos < finalPos) {
      todos.forEach((each) => {
        if (each.index[user] > initialPos && each.index[user] < finalPos) {
          // this reduces index of all items in between initial and final position by 1
          // console.log('existing', each.taskName, indexDict);
          let indexDict = each.index;
          indexDict[user] = indexDict[user] - 1;

          firebaseApp
            .firestore()
            .collection("todos")
            .doc(each.id)
            .update({
              index: indexDict,
            })
            .catch((error) => console.log(error));

          alterIndex("decrease", user, each.id, presentTodos, setPresentTodos);
          alterIndex(
            "decrease",
            user,
            each.id,
            originalPresentTodos,
            setOriginalPresentTodos
          );
        }
      });
    } else if (initialPos > finalPos) {
      // this increases index of all items in between initial and final position by 1
      todos.forEach((each) => {
        if (each.index[user] < initialPos && each.index[user] >= finalPos) {
          // this increases index of all items in between initial and final position by 1
          // console.log('existing', each.taskName, indexDict);
          let indexDict = each.index;
          indexDict[user] = indexDict[user] + 1;
          // console.log(each.taskName, indexDict);
          firebaseApp
            .firestore()
            .collection("todos")
            .doc(each.id)
            .update({
              index: indexDict,
            })
            .catch((error) => console.log(error));

          alterIndex("increase", user, each.id, presentTodos, setPresentTodos);
          alterIndex(
            "increase",
            user,
            each.id,
            originalPresentTodos,
            setOriginalPresentTodos
          );
        }
      });
    }
  }

  function postponeIndicesUpdate(
    user,
    presentTodosUser,
    futureTodosUser,
    newIndex
  ) {
    //reduces the index of all present tasks which ar below the postponed tasks and increases the index of future tasks which will be after the postponed task

    let currentTaskIndex = task.index[user];
    presentTodosUser.forEach((each) => {
      if (each.index[user] > currentTaskIndex) {
        let indexDict = each.index;
        indexDict[user] = indexDict[user] - 1;
        firebaseApp
          .firestore()
          .collection("todos")
          .doc(each.id)
          .update({
            index: indexDict,
          })
          .catch((error) => console.log(error));

        alterIndex("decrease", user, each.id, presentTodos, setPresentTodos);
        alterIndex("decrease", user, each.id, futureTodos, setFutureTodos);
        alterIndex(
          "decrease",
          user,
          each.id,
          originalPresentTodos,
          setOriginalPresentTodos
        );
        alterIndex(
          "decrease",
          user,
          each.id,
          originalFutureTodos,
          setOriginalFutureTodos
        );
      }
    });

    futureTodosUser.forEach((each) => {
      if (each.index[user] >= newIndex) {
        let indexDict = each.index;
        indexDict[user] = indexDict[user] + 1;
        firebaseApp
          .firestore()
          .collection("todos")
          .doc(each.id)
          .update({
            index: indexDict,
          })
          .catch((error) => console.log(error));
        alterIndex("increase", user, each.id, presentTodos, setPresentTodos);
        alterIndex("increase", user, each.id, futureTodos, setFutureTodos);
        alterIndex(
          "increase",
          user,
          each.id,
          originalPresentTodos,
          setOriginalPresentTodos
        );
        alterIndex(
          "increase",
          user,
          each.id,
          originalFutureTodos,
          setOriginalFutureTodos
        );
      }
    });
  }

  function deleteTodoManagePri(user, todos, taskIndex) {
    //this function manages index of todos below a certain todo in case i delete it
    todos.forEach((each) => {
      if (each.index[user] > taskIndex) {
        let indexDict = each.index;
        indexDict[user] = indexDict[user] - 1;
        // console.log(each.taskName, indexDict);
        firebaseApp
          .firestore()
          .collection("todos")
          .doc(each.id)
          .update({
            index: indexDict,
          })
          .catch((error) => console.log(error));

        alterIndex("decrease", user, each.id, presentTodos, setPresentTodos);
        alterIndex(
          "decrease",
          user,
          each.id,
          originalPresentTodos,
          setOriginalPresentTodos
        );
      }
    });
  }

  function postponeTodo() {
    let newFutureIndices = {};
    for (let deletedUser of taskRemovedUsers) {
      deleteTodoManagePri(
        deletedUser,
        originalPresentTodos[deletedUser],
        task.index[deletedUser]
      );
    }
    for (let taskUser of taskUsers) {
      newFutureIndices[taskUser] = decidePosition(
        futureTodos[taskUser],
        taskPri
      );
      if (todoTaskOriginalUsers.includes(taskUser)) {
        postponeIndicesUpdate(
          taskUser,
          originalPresentTodos[taskUser],
          originalFutureTodos[taskUser],
          newFutureIndices[taskUser]
        );
      } else {
        newTodoManagePri(
          taskUser,
          futureTodos[taskUser],
          newFutureIndices[taskUser]
        );
      }
      if (taskUsers.indexOf(taskUser) == taskUsers.length - 1) {
        // console.log(indexDict);
        firebaseApp
          .firestore()
          .collection("todos")
          .doc(taskId)
          .update({
            taskName: taskName,
            taskDesc: taskDesc,
            priority: taskPri,
            users: taskUsers,
            index: newFutureIndices,
            time: nextTime(),
            timesPostponed:
              task.timesPostponed != undefined ? task.timesPostponed + 1 : 1,
          });

        setPriChanged(false);
        slideback();
        setReloadEverything(!reloadEverything);
        shouldReload();
      }
    }
  }

  function saveTodo() {
    let newIndices = {};
    for (let taskUser of taskUsers) {
      newIndices[taskUser] = decidePosition(presentTodos[taskUser], taskPri);
    }
    if (taskId === null) {
      //makes a new todo if the id prop is empty str which means that no particular todo is opened
      for (let taskUser of taskUsers) {
        newTodoManagePri(
          taskUser,
          presentTodos[taskUser],
          newIndices[taskUser]
        );
        if (taskUsers.indexOf(taskUser) == taskUsers.length - 1) {
          // console.log(newIndices);
          let todo = {
            taskName: taskName,
            taskDesc: taskDesc,
            time: task.time,
            timeType: task.timeType,
            priority: taskPri,
            users: taskUsers,
            finished: false,
            index: newIndices,
          };
          firebaseApp.firestore().collection("todos").add(todo);
        }
      }
    } else {
      //modifies the properties of original todo if some exisiting todo is opened in modal
      let indexDict = task.index;
      for (let deletedUser of taskRemovedUsers) {
        deleteTodoManagePri(
          deletedUser,
          originalPresentTodos[deletedUser],
          task.index[deletedUser]
        );
        delete indexDict[deletedUser];
      }
      for (let taskUser of taskUsers) {
        if (todoTaskOriginalUsers.includes(taskUser)) {
          if (priChanged) {
            existingTodoPriChanged(taskUser, originalPresentTodos[taskUser]);
            indexDict[taskUser] =
              priChanged && indexDict[taskUser] < newIndices[taskUser]
                ? newIndices[taskUser] - 1
                : priChanged && indexDict[taskUser] > newIndices[taskUser]
                ? newIndices[taskUser]
                : indexDict[taskUser];
            //!  DON'T TOUCH IT PLEASE this piece of code was absolutely mind fucking
          }
        } else {
          newTodoManagePri(
            taskUser,
            presentTodos[taskUser],
            newIndices[taskUser]
          );
          indexDict[taskUser] = newIndices[taskUser];
        }
        if (taskUsers.indexOf(taskUser) == taskUsers.length - 1) {
          firebaseApp.firestore().collection("todos").doc(taskId).update({
            taskName: taskName,
            taskDesc: taskDesc,
            priority: taskPri,
            users: taskUsers,
            index: indexDict,
          });
          setPriChanged(false);
        }
      }
    }
    slideback();
    setReloadEverything(!reloadEverything);
    shouldReload();
  }

  // for (let user in presentTodos) {
  //   console.log("====");
  //   console.log(user);
  //   // console.log(presentTodos[user].length);
  //   presentTodos[user].forEach((todo) => {
  //     console.log(todo.taskName, todo.index[user], todo.priority);
  //   });
  //   console.log("====");
  // }

  // for (let user in futureTodos) {
  //   console.log("====");
  //   console.log(user);
  //   // console.log(futureTodos[user].length);
  //   futureTodos[user].forEach((todo) => {
  //     console.log(todo.taskName, todo.index[user], todo.priority);
  //   });
  //   console.log("====");
  // }

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
          {task.id != undefined ? (
            task.timesPostponed != undefined ? (
              <span id="postponeText">{postponeText()}</span>
            ) : (
              <></>
            )
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
            {task.id != undefined ? (
              task.timeType != "longTerm" && !task.finished ? (
                <IconButton
                  title="Postpone"
                  id="modalPostponeButton"
                  onClick={() => postponeTodo()}
                >
                  <MdSubdirectoryArrowRight />
                </IconButton>
              ) : (
                <></>
              )
            ) : (
              <span></span>
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
