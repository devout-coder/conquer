import { Checkbox } from "@material-ui/core";
import React, { useState } from "react";
import firebaseApp from "../../firebase";
import "./EachTodo.css";

function EachTodo(props) {
  const [checked, setChecked] = useState(props.finished);
  // console.log(props.finished)
  const handleChange = (event) => {
    setChecked(event.target.checked);
    props.activateLoader(true);
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
        console.log("check loading ended");
        props.startLoading();
        props.activateLoader(false);
      });
  };
  return (
    <div className="eachTodo">
      <Checkbox
        style={{
          color: props.finished
            ? "#474747"
            : props.priority == 3
            ? "#ff5151"
            : props.priority == 2
            ? "#e6e958"
            : props.priority == 1
            ? "#20e734"
            : "rgba(198, 196, 196, 0.61)",
        }}
        checked={checked}
        onChange={handleChange}
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
      >
        {props.taskName}
      </div>
    </div>
  );
}

export default EachTodo;
