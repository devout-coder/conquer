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
  const [openTodoModal, setOpenTodoModal] = useState(false);
  // function openModal() {
  //   document.getElementsByClassName("modalBackground")[0].style.visibility =
  //     "visible";
  //   document.getElementsByClassName("modal")[0].style.opacity = "100";
  // }
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
            <span className="toDisplay">{time}</span>
            <IconButton onClick={() => setOpenTodoModal(true)} title="New Todo">
              <QueueIcon />
            </IconButton>
          </div>
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
                    finished={each.finished}
                    startLoading={() => loadData()}
                    activateLoader={(shouldLoad) => setLoading(shouldLoad)}
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
                    finished={each.finished}
                    startLoading={() => loadData()}
                    activateLoader={(shouldLoad) => setLoading(shouldLoad)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default AllTodos;
