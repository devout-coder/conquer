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
import { useHistory } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

function EachTodo(props) {
  const [checked, setChecked] = useState(props.finished);
  const [modalOpen, setModalOpen] = useState(false); //this state controls the delete modal
  const history = useHistory();
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
    if (isMobile.any() && !props.sidebarTodo) {
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
  function ConstJSX(newProps){
    return(
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
      {!props.sidebarTodo && !props.finished ? (
        <div className="dragger" {...newProps.dragger}>
          <DragIndicatorIcon style={{ color: "#c6c4c4" }}></DragIndicatorIcon>
        </div>
      ) : (
        <div></div>
      )}
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
          onClick={() =>
            props.timeType != "year"
              ? history.push({
                  pathname: `${props.timeType}/allTodos`,
                  state: { time: props.time, lastPage: props.timeType },
                })
              : history.push({
                  pathname: "/year",
                  state: { time: props.time },
                })
          }
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
    )

  };

  return !props.sidebarTodo ? (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <ConstJSX dragger = {provided.dragHandleProps} />
        </div>
      )}
    </Draggable>
  ) : (
    <ConstJSX/>
  );
}

export default EachTodo;
