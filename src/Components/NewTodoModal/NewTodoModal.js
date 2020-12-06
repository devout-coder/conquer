import React from "react";
import "./NewTodoModal.css";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import { ArrowBack, Save } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

function NewTodoModal() {
  function closeModal() {
    document.getElementsByClassName("modalBackground")[0].style.visibility =
      "hidden";
    document.getElementsByClassName("modal")[0].style.opacity = "0";
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
          />
          <IconButton title="Priority" id="modalpriorityButton">
            <PriorityHighIcon />
          </IconButton>
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
