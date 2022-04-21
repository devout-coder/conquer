import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import firebaseApp from "../../firebase";
import DeleteIcon from "@material-ui/icons/Delete";
import "./EachTodo.css";
import { useHistory } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { loadingContext } from "../../loadingContext";
import PeopleIcon from "../../images/people.png";

function EachTodo({ task, startLoading, expandTodo, sidebarTodo }) {
  const user = useContext(loadingContext);

  const [checked, setChecked] = useState(task.finished);
  const [modalOpen, setModalOpen] = useState(false); //this state controls the delete modal
  const history = useHistory();
  let allTasks = {};

  const checkUncheckfunc = (event) => {
    //this toggles check of todo checkbox and also toggles boolean value of finished property of that particular todo in firestore
    setChecked(event.target.checked);
    firebaseApp
      .firestore()
      .collection("todos")
      .doc(task.id)
      .set(
        {
          finished: !checked ? true : false, //this seems contradictory but due to some reason value of checked is false when i check it and true when i uncheck
        },
        { merge: true }
      )
      .then(() => {
        startLoading(); //this triggers that loadData func in allTodos which fetches all todos again
      });
  };

  const alterIndex = (user, taskId) => {
    //keeps allTasks updated with the reduced indices
    let allTodos = allTasks;
    for (let allTodosUser in allTodos) {
      let userTodos = allTodos[allTodosUser];
      userTodos = userTodos.map((eachTodo) => {
        if (eachTodo.id == taskId) {
          let tempInd = eachTodo.index;
          tempInd[user] = tempInd[user] - 1;
          eachTodo.index = tempInd;
        }
        return eachTodo;
      });
      allTodos[allTodosUser] = userTodos;
    }
    allTasks = allTodos;
  };

  function deleteTodoManagePri(user, todos, taskIndex) {
    //this function manages index of todos below a certain todo in case i delete it
    todos.forEach((each) => {
      if (each.index[user] > taskIndex) {
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

        alterIndex(user, each.id);
      }
    });
  }

  function deleteTodo() {
    //this func deletes that particular todo
    let tasksDict = {};
    task.users.forEach((taskUser) => {
      firebaseApp
        .firestore()
        .collection("todos")
        .where("users", "array-contains", taskUser)
        .where("time", "==", task.time)
        .get()
        .then((snap) => {
          let all = [];
          snap.docs.map((each) => {
            let eachdict = {
              id: each.id,
              index: each.get("index"),
            };
            all.push(eachdict);
          });
          tasksDict[taskUser] = all;
          if (task.users.length == Object.keys(tasksDict).length) {
            allTasks = tasksDict;
            for (let todoUser in allTasks) {
              deleteTodoManagePri(
                todoUser,
                allTasks[todoUser],
                task.index[todoUser]
              );
              if (
                Object.keys(allTasks).indexOf(todoUser) ==
                Object.keys(allTasks).length - 1
              ) {
                firebaseApp
                  .firestore()
                  .collection("todos")
                  .doc(task.id)
                  .delete()
                  .then(() => {
                    setModalOpen(false);
                    startLoading();
                  })
                  .catch((error) => console.log(error));
              }
            }
          }
        });
    });
  }

  var isMobile = {
    //this object contains properties whose values is a func which returns true if the device being used is that property
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return (
        navigator.userAgent.match(/IEMobile/i) ||
        navigator.userAgent.match(/WPDesktop/i)
      );
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };
  function handleTodoClick() {
    if (isMobile.any() && !sidebarTodo) {
      let reqElem = document.getElementById(task.id);
      if (Array.from(reqElem.classList).includes("phoneTodo")) {
        //this conditional checks if the todo has already been clicked and if thats the case then it is expanded
        expandTodo(task);
      } else {
        //if the todo is not already clicked then phoneTodo is added to its classList which changes the color of the todo and also makes the delete button visible
        reqElem.classList.add("phoneTodo");
      }
    } else {
      expandTodo(task);
    }
  }
  document.addEventListener("click", (eve) => {
    let reqElem = document.getElementById(task.id);
    if (reqElem != null) {
      let isClickInside = reqElem.contains(eve.target);
      if (!isClickInside) {
        reqElem.classList.remove("phoneTodo");
      }
    }
  });

  function ConstJSX(newProps) {
    return (
      <div
        className={isMobile.any() ? "eachTodo" : "eachTodo laptopTodo"}
        id={task.id}
      >
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this item from your list?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)} color="secondary">
              No
            </Button>
            <Button onClick={deleteTodo} color="primary" autoFocus>
              Yeah
            </Button>
          </DialogActions>
        </Dialog>
        {!sidebarTodo && !task.finished ? (
          <div className="dragger" {...newProps.dragger}>
            <DragIndicatorIcon style={{ color: "#c6c4c4" }}></DragIndicatorIcon>
          </div>
        ) : (
          <div></div>
        )}
        <Checkbox
          style={{
            color: task.finished
              ? "#474747"
              : task.priority == 3
              ? "#ff5151"
              : task.priority == 2
              ? "#7885fb"
              : task.priority == 1
              ? "#20e734"
              : "rgba(198, 196, 196, 0.61)", //different color based on priority
          }}
          checked={checked}
          onChange={checkUncheckfunc}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
        <div
          className={
            task.finished
              ? "finishedTodo eachTodoTaskName"
              : task.priority == 3
              ? "highPriority eachTodoTaskName"
              : task.priority == 2
              ? "mediumPriority eachTodoTaskName"
              : task.priority == 1
              ? "lowPriority eachTodoTaskName"
              : "noPriority eachTodoTaskName"
          }
          onClick={() => {
            handleTodoClick();
          }}
        >
          {task.taskName}
        </div>
        {sidebarTodo ? (
          <span
            className="todoTime"
            onClick={() =>
              task.timeType != "year"
                ? history.push({
                    pathname: `${task.timeType}/allTodos`,
                    state: { time: task.time, timeType: task.timeType },
                  })
                : history.push({
                    pathname: "/year",
                    state: { time: task.time },
                  })
            }
          >
            {task.time}
          </span>
        ) : (
          <span className="noTodoTime"></span>
        )}

        {task.users.length > 1 ? (
          <img className="sharedIcon" src={PeopleIcon} alt="Shared Icon" />
        ) : (
          <></>
        )}

        <div className="deleteIcon">
          <IconButton onClick={() => setModalOpen(true)}>
            <DeleteIcon
              style={{
                color: "#FF3131",
              }}
            />
          </IconButton>
        </div>
      </div>
    );
  }

  return !sidebarTodo && !task.finished ? (
    <Draggable draggableId={task.id} index={task.index[user.uid]}>
      {(provided, snapshot) => (
        <div {...provided.draggableProps} ref={provided.innerRef}>
          <ConstJSX dragger={provided.dragHandleProps} />
        </div>
      )}
    </Draggable>
  ) : (
    <ConstJSX />
  );
}

export default EachTodo;
