import React, { useEffect, useState } from "react";
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
  const [taskPri, setTaskPri] = useState(props.taskPri);
  const [taskName, setTaskName] = useState(props.taskName);
  const [taskDesc, setTaskDesc] = useState(props.taskDesc);
  const [taskId, settaskId] = useState(props.taskId);
  const [ctrlPressed, setCtrlPressed] = useState(false)

  function changePriority(event) {
    setTaskPri(event.target.value);
  }
  function displayPriProperly() {
    //this func basically hides the priority name and unhides the none priority(cause by default it is hidden..😒😒mui)
    document.getElementsByClassName(
      "MuiSelect-root"
    )[0].lastChild.style.display = "none";
    if (taskPri == "0") {
      document.getElementsByClassName(
        "MuiSelect-root"
      )[0].firstElementChild.style.display = "block";
    }
  }
  useEffect(() => {
    displayPriProperly();
  }, [taskPri]);
  function saveTodo() {
    if (props.taskId === "") {
      //makes a new todo if the id prop is empty str which means that no particular todo is opened
      firebaseApp
        .firestore()
        .collection("todos")
        .add({
          taskName: taskName,
          taskDesc: taskDesc,
          time: props.time,
          priority: taskPri,
          user: firebaseApp.auth().currentUser.uid,
          finished: false,
        })
        .then(() => {
          props.shouldReload(); //triggers loadData() in allTodos which fetches all todos again from firestore
        });
    } else {
      //modifies the properties of original todo if some exisiting todo is opened in modal
      firebaseApp
        .firestore()
        .collection("todos")
        .doc(taskId)
        .set(
          {
            taskName: taskName,
            taskDesc: taskDesc,
            priority: taskPri,
          },
          { merge: true }
        )
        .then(() => {
          props.shouldReload();
        });
    }
    props.openTodoModal(false);
  }

  return (
    <div
      className="modalBackground"
      onClick={(e) => {
        try {
          if (!document.getElementsByClassName("modal")[0].contains(e.target)) {
            //this if statement checks if the click is inside the modal of not
            props.openTodoModal(false);
          }
        } catch (error) {} //ve added a try catch statement cause it gives error when i open the priority list
      }}
      onKeyDown={(evt) => {
        //this function checks for keypresses..in case esc button is pressed modal is closed..if ctrl+s is pressed its saved
        if (evt.key=="Escape"){
          props.openTodoModal(false);
        }else if(evt.key=="Control"){
          setCtrlPressed(true)
        }else if(evt.key=="s" && ctrlPressed){
          setCtrlPressed(false)
          evt.preventDefault()
          saveTodo()
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
            maxLength="42"
            onChange={(e) => setTaskName(e.target.value)}
          />
          <div className="modalButtons">
            <FormControl>
              <Select value={taskPri} onChange={changePriority} displayEmpty>
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
              onClick={() => props.openTodoModal(false)}
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
