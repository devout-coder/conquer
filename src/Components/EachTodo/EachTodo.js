import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import firebaseApp from "../../firebase";
import DeleteIcon from "@material-ui/icons/Delete";
import "./EachTodo.css";

function EachTodo(props) {
  const [checked, setChecked] = useState(props.finished);
  const [modalOpen, setModalOpen] = useState(false); //this state controls the delete modal
  const [mobile, setMobile] = useState(false);
  const checkUncheckfunc = (event) => {
    //this toggles check of todo checkbox and also toggles boolean value of finished property of that particular todo in firestore
    setChecked(event.target.checked);
    firebaseApp
      .firestore()
      .collection("todos")
      .doc(props.id)
      .set(
        {
          finished: !checked ? true : false, //this seems contradictory but due to some reason value of checked is false when i check it and true when i uncheck
        },
        { merge: true }
      )
      .then(() => {
        props.startLoading(); //this triggers that loadData func in allTodos which fetches all todos again
      });
  };
  function deleteTodo() {
    //this func deletes that particular todo
    setModalOpen(false);
    firebaseApp
      .firestore()
      .collection("todos")
      .doc(props.id)
      .delete()
      .then(() => {
        props.startLoading();
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
    if (isMobile.any()) {
      let reqElem = document.getElementById(props.id);
      if (Array.from(reqElem.classList).includes("phoneTodo")) {
        //this conditional checks if the todo has already been clicked and if thats the case then it is expanded
        props.expandTodo(
          //this triggers the func in all todos which renders the todo modal with all these parameters as props
          props.id,
          props.taskName,
          props.taskDesc,
          props.priority,
          props.time,
          props.timeType
        );
      } else {
        //if the todo is not already clicked then phoneTodo is added to its classList which changes the color of the todo and also makes the delete button visible
        reqElem.classList.add("phoneTodo");
      }
    } else {
      props.expandTodo(
        //this triggers the func in all todos which renders the todo modal with all these parameters as props
        props.id,
        props.taskName,
        props.taskDesc,
        props.priority,
        props.time,
        props.timeType
      );
    }
  }

  document.addEventListener("click", (eve) => {
    let reqElem = document.getElementById(props.id);
    if (reqElem != null) {
      let isClickInside = reqElem.contains(eve.target);
      if (!isClickInside) {
        reqElem.classList.remove("phoneTodo");
      }
    }
  });

  return (
    <div
      className={isMobile.any() ? "eachTodo" : "eachTodo laptopTodo"}
      id={props.id}
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
      <Checkbox
        style={{
          color: props.finished
            ? "#474747"
            : props.priority == 3
            ? "#ff5151"
            : props.priority == 2
            ? "#7885fb"
            : props.priority == 1
            ? "#20e734"
            : "rgba(198, 196, 196, 0.61)", //different color based on priority
        }}
        checked={checked}
        onChange={checkUncheckfunc}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <div
        className={
          props.finished
            ? "finishedTodo eachTodoTaskName"
            : props.priority == 3
            ? "highPriority eachTodoTaskName"
            : props.priority == 2
            ? "mediumPriority eachTodoTaskName"
            : props.priority == 1
            ? "lowPriority eachTodoTaskName"
            : "noPriority eachTodoTaskName"
        }
        onClick={() => {
          handleTodoClick();
        }}
      >
        {props.taskName}
      </div>
      {props.sidebarTodo ? (
        <span
          className="todoTime"
          onClick={() => {
            handleTodoClick();
          }}
        >
          {props.time}
        </span>
      ) : (
        <span className="noTodoTime"></span>
      )}
      <IconButton onClick={() => setModalOpen(true)}>
        <DeleteIcon
          style={{
            color: "#FF3131",
          }}
        />
      </IconButton>
    </div>
  );
}

export default EachTodo;
