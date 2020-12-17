import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import React, { useState } from "react";
import firebaseApp from "../../firebase";
import DeleteIcon from "@material-ui/icons/Delete";
import "./EachTodo.css";
import NewTodoModal from "../NewTodoModal/NewTodoModal";

function EachTodo(props) {
  const [checked, setChecked] = useState(props.finished);
  const [modalOpen, setModalOpen] = useState(false);
  const handleClickOpen = () => {
    setModalOpen(true);
  };
  const handleClickClose = () => {
    setModalOpen(false);
  };
  const checkUncheckfunc = (event) => {
    setChecked(event.target.checked);
    // props.activateLoader(true);
    firebaseApp
      .firestore()
      .collection("todos")
      .doc(props.id)
      .set(
        {
          finished: !checked ? true : false,
        },
        { merge: true }
      )
      .then(() => {
        // console.log("check loading ended");
        props.startLoading();
        // props.activateLoader(false);
      });
  };
  function deleteTodo() {
    handleClickClose();
    // props.activateLoader(true);
    firebaseApp
      .firestore()
      .collection("todos")
      .doc(props.id)
      .delete()
      .then(() => {
        props.startLoading();
        // props.activateLoader(false);
      });
  }
  return (
    <div className="eachTodo">
      <Dialog
        open={modalOpen}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this item from your list?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClickClose} color="secondary">
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
            : "rgba(198, 196, 196, 0.61)",
        }}
        checked={checked}
        onChange={checkUncheckfunc}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <p
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
        onClick={()=>{props.expandTodo(props.id, props.taskName, props.taskDesc, props.priority)}
      }
      >
        {props.taskName}
      </p>
      <IconButton onClick={handleClickOpen}>
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
