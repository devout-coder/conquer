import { Checkbox } from "@material-ui/core";
import React from "react";
import './EachTodo.css'

function EachTodo(props) {
  return (
    <div className="eachTodo">
      <Checkbox
        style={{
          color:
            props.priority == 3
              ? "#ff5151"
              : props.priority == 2
              ? "#e6e958"
              : props.priority == 1
              ? "#20e734"
              : "rgba(198, 196, 196, 0.5)",
        }}
        // checked={checked}
        // onChange={handleChange}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <div
        className={
          props.priority == 3
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
