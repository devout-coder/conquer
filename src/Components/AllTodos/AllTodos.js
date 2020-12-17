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
  const location = useLocation();
  const time = location.state.time;
  const lastPage = location.state.lastPage;
  const [finishedTodos, setFinishedTodos] = useState([]);
  const [unfinishedTodos, setUnfinishedTodos] = useState([]);
  const [expandTaskId, setExpandTaskId] = useState("");
  const [expandTaskName, setExpandTaskName] = useState("");
  const [expandTaskDesc, setExpandTaskDesc] = useState("");
  const [expandTaskPri, setExpandTaskPri] = useState("0");
  const [openTodoModal, setOpenTodoModal] = useState(false);
  function loadData() {
    setLoading(true);
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
            finished.push(eachdict);
          } else {
            unfinished.push(eachdict);
          }
        });
        setFinishedTodos(finished);
        setUnfinishedTodos(unfinished);
      });
    setLoading(false);
  }
  function expandTodo(id, taskName, taskDesc, taskPri) {
    setExpandTaskName(taskName);
    setExpandTaskDesc(taskDesc);
    setExpandTaskPri(taskPri);
    setExpandTaskId(id);
    setOpenTodoModal(true);
  }
  function expandBlankTodo() {
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
          shouldReload={() => loadData()}
          openTodoModal={(shouldOpen) => setOpenTodoModal(shouldOpen)}
          taskId={expandTaskId}
          activateLoader={(shouldLoad) => setLoading(shouldLoad)}
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
            <IconButton
              title="Back"
              onClick={() => history.push(`/${lastPage}`)}
            >
              <ArrowBackIcon />
            </IconButton>
            <span className="time">{time}</span>
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
            <div className="noTodosMessage">Schedule seems clear...😎😎</div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default AllTodos;
