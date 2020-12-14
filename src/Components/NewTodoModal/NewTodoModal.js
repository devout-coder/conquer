import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import { ArrowBack, Save } from "@material-ui/icons";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
} from "@material-ui/core";
import "./NewTodoModal.css";
import firebaseApp from "../../firebase";

function NewTodoModal(props) {
  const [pri, setPri] = useState("0");
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  function handleChange(event) {
    setPri(event.target.value);
  }
  function closeModal() {
    setTaskName("");
    setTaskDesc("");
    setPri("0");
    document.getElementsByClassName("modalBackground")[0].style.visibility =
      "hidden";
    document.getElementsByClassName("modal")[0].style.opacity = "0";
  }
  function togglePriorities() {
    document.getElementById("prioritiesDropdown").style.display = "flex";
  }
  useEffect(() => {
    document.getElementsByClassName(
      "MuiSelect-root"
    )[0].lastChild.style.display = "none";
    if (pri == "0") {
      document.getElementsByClassName(
        "MuiSelect-root"
      )[0].firstElementChild.style.display = "block";
    }
  }, [pri]);
  function saveTodo() {
    firebaseApp.firestore().collection("todos").add({
      taskName: taskName,
      taskDesc: taskDesc,
      time: props.toDisplay,
      priority: pri,
      user: firebaseApp.auth().currentUser.uid,
      finished: false,
    });
    props.shouldReload(true)
    closeModal();
  }

  return (
    <div className="modalBackground">
      <div className="modal">
        <div className="modalTopbar">
          <input
            type="text"
            id="modalTaskName"
            placeholder="Task Name"
            spellCheck="false"
            value={taskName}
            autoComplete="off"
            maxLength="25"
            onChange={(e) => setTaskName(e.target.value)}
          />
          <div className="modalButtons">
            <FormControl>
              <Select value={pri} onChange={handleChange} displayEmpty>
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
              onClick={() => closeModal()}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              title="Save"
              id="modalSaveButton"
              onClick={() => saveTodo()}
            >
              <Save />
            </IconButton>
          </div>
        </div>
        <hr />
        <textarea
          spellCheck="false"
          id="modalTaskDesc"
          placeholder="Task Description"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

export default NewTodoModal;
