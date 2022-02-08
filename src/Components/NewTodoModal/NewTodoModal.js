import React, { useState } from "react";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import { ArrowBack, Save } from "@material-ui/icons";
import {
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
} from "@material-ui/core";
import "./NewTodoModal.css";
import firebaseApp from "../../firebase";
import { useEffect } from "react";
import { useRef } from "react";

function NewTodoModal(props) {
  const [taskPri, setTaskPri] = useState(props.taskPri);
  const [taskName, setTaskName] = useState(props.taskName);
  const [taskDesc, setTaskDesc] = useState(props.taskDesc);
  const [taskId, settaskId] = useState(props.taskId);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [priChanged, setPriChanged] = useState(false);
  const initialRender = useRef(true);
  //useRef is used to store data which doesn't change even on re-render

  function slideback() {
    //this new class removeModal will be added which has a cool slideback animation attached to it
    document.getElementsByClassName("modal")[0].classList.add("removeModal");
    setTimeout(() => {
      props.openTodoModal(false);
    }, 800);
  }

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      //once its set false even though the component re-renders its value be false
    } else {
      setPriChanged(true);
    }
  }, [taskPri]);

  function decidePosition(priority) {
    //this function takes a priority and returns the sutiable index for a new element of that priority
    let reqIndex;
    props.priPosition.forEach((each) => {
      if (priority == each[0]) {
        reqIndex = each[1];
      }
    });
    return reqIndex;
  }

  function newTodoManagePri(newIndex) {
    // it increases the index of all todos which have index value equal to or more than newIndex
    props.unfinishedTodos.forEach((each, index) => {
      if (index >= newIndex) {
        firebaseApp
          .firestore()
          .collection("todos")
          .doc(each.id)
          .update({
            index: index + 1,
          });
      }
    });
  }

  function existingTodoChangePri() {
    //this changes the priority of all todos in between the todo and its new position

    let initialPos = props.taskIndex;
    let finalPos = decidePosition(taskPri);
    if (initialPos < finalPos) {
      props.unfinishedTodos.forEach((each, index) => {
        if (index > initialPos && index < finalPos) {
          // this reduces index of all items in between initial and final position by 1
          firebaseApp
            .firestore()
            .collection("todos")
            .doc(each.id)
            .update({
              index: index - 1,
            });
        }
      });
    } else if (initialPos > finalPos) {
      // this increases index of all items in between initial and final position by 1
      props.unfinishedTodos.forEach((each, index) => {
        if (index < initialPos && index >= finalPos) {
          firebaseApp
            .firestore()
            .collection("todos")
            .doc(each.id)
            .update({
              index: index + 1,
            });
        }
      });
    }
  }

  function saveTodo() {
    if (props.taskId === "") {
      //makes a new todo if the id prop is empty str which means that no particular todo is opened

      newTodoManagePri(decidePosition(taskPri));
      let todo = {
        taskName: taskName,
        taskDesc: taskDesc,
        time: props.time,
        timeType: props.lastPage,
        priority: taskPri,
        user: firebaseApp.auth().currentUser.uid,
        finished: false,
        index: decidePosition(taskPri),
      };
      firebaseApp.firestore().collection("todos").add(todo);
    } else {
      //modifies the properties of original todo if some exisiting todo is opened in modal
      if (priChanged) {
        existingTodoChangePri();
      }
      firebaseApp
        .firestore()
        .collection("todos")
        .doc(taskId)
        .set(
          {
            taskName: taskName,
            taskDesc: taskDesc,
            priority: taskPri,
            index:
              //props.taskIndex is the inital position and decidePosition(taskPri) gives the final position
              //!  DON'T TOUCH IT PLEASE this piece of code was absolutely mind fucking
              priChanged && props.taskIndex < decidePosition(taskPri)
                ? decidePosition(taskPri) - 1
                : priChanged && props.taskIndex > decidePosition(taskPri)
                ? decidePosition(taskPri)
                : props.taskIndex,
          },
          { merge: true }
        );
      setPriChanged(false);
    }
    props.shouldReload();
    slideback();
  }

  return (
    <div
      className="modalBackground"
      onClick={(e) => {
        try {
          if (!document.getElementsByClassName("modal")[0].contains(e.target)) {
            //this if statement checks if the click is inside the modal of not
            slideback();
          }
        } catch (error) {} //ve added a try catch statement cause it gives error when i open the priority list
      }}
      onKeyDown={(evt) => {
        //this function checks for keypresses..in case esc button is pressed modal is closed..if ctrl+s is pressed its saved
        if (evt.key == "Escape") {
          slideback();
        } else if (evt.key == "Control") {
          setCtrlPressed(true);
        } else if (evt.key == "s" && ctrlPressed) {
          setCtrlPressed(false);
          evt.preventDefault();
          saveTodo();
        }
      }}
      onKeyUp={(evt) => {
        if (evt.key == "Control") {
          setCtrlPressed(false);
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
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <hr />
        <textarea
          spellCheck="false"
          id="modalTaskDesc"
          placeholder="Task Description"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
        ></textarea>
        <div className="modalButtons">
          <FormControl>
            <Select
              value={taskPri}
              onChange={(e) => setTaskPri(e.target.value)}
              displayEmpty
            >
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
            onClick={() => slideback()}
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
    </div>
  );
}

export default NewTodoModal;
