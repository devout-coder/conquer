import React, { useEffect, useState } from "react";
import "./NewTodoModal.css";
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

function NewTodoModal() {
  const [pri, setPri] = useState("none");
  function handleChange(event) {
    setPri(event.target.value);
  }
  function closeModal() {
    document.getElementsByClassName("modalBackground")[0].style.visibility =
      "hidden";
    document.getElementsByClassName("modal")[0].style.opacity = "0";
  }
  function togglePriorities() {
    document.getElementById("prioritiesDropdown").style.display = "flex";
  }
  console.log(pri);
  useEffect(() => {
    document.getElementsByClassName(
      "MuiSelect-root"
    )[0].lastChild.style.display = "none";
    console.log(document.getElementsByClassName("MuiSelect-root")[0].lastChild);
    if (pri == "none") {
      document.getElementsByClassName(
        "MuiSelect-root"
      )[0].firstElementChild.style.display = "block";
    }
  }, [pri]);
  return (
    <div className="modalBackground">
      <div className="modal">
        <div className="modalTopbar">
          <input
            type="text"
            id="modalTaskName"
            placeholder="Task Name"
            spellCheck="false"
          />
          <div className="modalButtons">
            <FormControl>
              <Select
                value={pri}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="high">
                  <PriorityHighIcon
                    id="highPriority"
                    style={{ color: "#FF3131" }}
                  ></PriorityHighIcon>
                  <span>High</span>
                </MenuItem>
                <MenuItem value="medium">
                  <PriorityHighIcon
                    id="mediumPriority"
                    style={{ color: "#BBB411" }}
                  ></PriorityHighIcon>
                  <span>Medium</span>
                </MenuItem>
                <MenuItem value="low">
                  <PriorityHighIcon
                    id="lowPriority"
                    style={{ color: "#11B421" }}
                  ></PriorityHighIcon>
                  <span>Low</span>
                </MenuItem>
                <MenuItem value="none">
                  <PriorityHighIcon></PriorityHighIcon>
                  <span>No priority</span>
                </MenuItem>
              </Select>
              <FormHelperText>Priority</FormHelperText>
            </FormControl>
            {/* <div id="prioritiesDropdown">
              <div className="eachPriority">
                <PriorityHighIcon
                  id="highPriority"
                  style={{ color: "#FF3131" }}
                ></PriorityHighIcon>
                <span>High</span>
              </div>
              <div className="eachPriority">
                <PriorityHighIcon
                  id="mediumPriority"
                  style={{ color: "#BBB411" }}
                ></PriorityHighIcon>
                <span>Medium</span>
              </div>
              <div className="eachPriority">
                <PriorityHighIcon
                  id="lowPriority"
                  style={{ color: "#11B421" }}
                ></PriorityHighIcon>
                <span>Low</span>
              </div>
            </div> */}
            <IconButton
              title="Back"
              id="modalBackButton"
              onClick={() => closeModal()}
            >
              <ArrowBack />
            </IconButton>
            <IconButton title="Save" id="modalSaveButton">
              <Save />
            </IconButton>
          </div>
        </div>
        <hr />
        <textarea
          spellCheck="false"
          id="modalTaskDesc"
          placeholder="Task Description"
        ></textarea>
      </div>
    </div>
  );
}

export default NewTodoModal;
