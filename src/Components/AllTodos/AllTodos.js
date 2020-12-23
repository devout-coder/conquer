import { Checkbox, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import QueueIcon from "@material-ui/icons/Queue";
import NewTodoModal from "../NewTodoModal/NewTodoModal";
import firebaseApp from "../../firebase";
import Loading from "../Loading/Loading";
import "./AllTodos.css";
import EachTodo from "../EachTodo/EachTodo";

function AllTodos(props) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation(); //holds props
  const time = location.state.time; //this holds the date/month/week/year of which the user wants all todos
  const lastPage = location.state.lastPage; //this holds daily/weekly/monthly/yearly basically the type of time wanted
  const [finishedTodos, setFinishedTodos] = useState([]);
  const [unfinishedTodos, setUnfinishedTodos] = useState([]);
  const [expandTaskId, setExpandTaskId] = useState("");
  const [expandTaskName, setExpandTaskName] = useState("");
  const [expandTaskDesc, setExpandTaskDesc] = useState("");
  const [expandTaskPri, setExpandTaskPri] = useState("0");
  //if any specific todo is clicked, all these expandTask details will be passed as a prop to the modal
  const [openTodoModal, setOpenTodoModal] = useState(false);
  //whenever this is true modal with required props is rendered
  function loadData() {
    //this function fetches todos from firebase of the specific time, distinguishes them as finished and unfinished and stores them in state variables

    // setLoading(true); //this activates the Loading component with that damn loader
    firebaseApp
      .firestore()
      .collection("todos")
      .where("user", "==", firebaseApp.auth().currentUser.uid)
      .where("time", "==", time)
      .orderBy("priority", "desc")
      .get()
      .then((snap) => {
        let finished = [];
        let unfinished = [];
        snap.docs.map((each) => {
          let eachdict = {
            id: each.id,
            taskName: each.get("taskName"),
            taskDesc: each.get("taskDesc"),
            priority: each.get("priority"),
            finished: each.get("finished"),
            time: each.get("time"),
          };
          if (each.get("finished")) {
            //each doc in todos collection of firebase is added to either finished or unfinished list based on its finished status
            finished.push(eachdict);
          } else {
            unfinished.push(eachdict);
          }
        });
        setFinishedTodos(finished);
        setUnfinishedTodos(unfinished);
      });
    // setLoading(false); //when all the data is fetched and finished and unfinished todos are set the Loading component is stopped from rendering
  }
  function replaceDate(date) {
    return date.replace(/\s\d{4}/g, "");
  }
  function expandTodo(id, taskName, taskDesc, taskPri) {
    //this function uses the parameters given by the particular todo triggering this function and sets those parameters equal to the state..then the modal is opened with these states as props
    setExpandTaskName(taskName);
    setExpandTaskDesc(taskDesc);
    setExpandTaskPri(taskPri);
    setExpandTaskId(id);
    setOpenTodoModal(true);
  }
  function expandBlankTodo() {
    //this opens a blank todo with no props regarding details of any todo
    setExpandTaskName("");
    setExpandTaskDesc("");
    setExpandTaskPri("0");
    setExpandTaskId("");
    setOpenTodoModal(true);
  }
  useEffect(() => {
    loadData();
  }, []);
  return !loading ? (
    <div className="allTodos">
      {openTodoModal ? (
        <NewTodoModal
          time={time}
          shouldReload={() => loadData()} //when this function is triggered data is fetched and saved in finished and unfinished todos state
          openTodoModal={(shouldOpen) => setOpenTodoModal(shouldOpen)}
          //this function can change the state which controls opening and closing of modal
          activateLoader={(shouldLoad) => setLoading(shouldLoad)} //this func triggers rendering of Loading component...
          taskId={expandTaskId}
          taskName={expandTaskName}
          taskDesc={expandTaskDesc}
          taskPri={expandTaskPri}
        />
      ) : (
        <div></div>
      )}
      <Navbar />
      <div className="allTodosPage">
        <Sidebar />
        <div className="allTodosPageEmpty">
          <div className="topbar">
            {lastPage != "longTerm" && lastPage != "year" ? (
              <IconButton
                title="Back"
                onClick={() => history.push(`/${lastPage}`)}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <div></div>
            )}
            <span className="time">{replaceDate(time)}</span>
            <IconButton onClick={() => expandBlankTodo()} title="New Todo">
              <QueueIcon />
            </IconButton>
          </div>
          {unfinishedTodos.length != 0 || finishedTodos.length != 0 ? (
            <div className="mainTodos">
              <div className="unfinishedTodos">
                <div className="noUnfinished noTodos">
                  {unfinishedTodos.length} unfinished
                </div>
                <div className="unfinishedTodosList">
                  {unfinishedTodos.map((each) => (
                    <EachTodo
                      id={each.id}
                      priority={each.priority}
                      taskName={each.taskName}
                      taskDesc={each.taskDesc}
                      finished={each.finished}
                      startLoading={() => loadData()}
                      activateLoader={(shouldLoad) => setLoading(shouldLoad)}
                      expandTodo={(id, taskName, taskDesc, taskPri) =>
                        expandTodo(id, taskName, taskDesc, taskPri)
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="finishedTodos">
                <div className="noFinished noTodos">
                  {finishedTodos.length} finished
                </div>
                <div className="finishedTodosList">
                  {finishedTodos.map((each) => (
                    <EachTodo
                      id={each.id}
                      priority={each.priority}
                      taskName={each.taskName}
                      taskDesc={each.taskDesc}
                      finished={each.finished}
                      startLoading={() => loadData()}
                      activateLoader={(shouldLoad) => setLoading(shouldLoad)}
                      expandTodo={(id, taskName, taskDesc, taskPri) =>
                        expandTodo(id, taskName, taskDesc, taskPri)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            //this is rendered if the length of both finished and unfinished todos is 0
            <div className="noTodosMessage">No tasks added yet!</div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default AllTodos;
