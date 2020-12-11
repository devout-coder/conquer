import { IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./AllTodos.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import QueueIcon from "@material-ui/icons/Queue";
import NewTodoModal from "../NewTodoModal/NewTodoModal";
import firebaseApp from "../../firebase";
import Loading from "../Loading/Loading";

function AllTodos(props) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const toDisplay = location.state.toDisplay;
  const lastPage = location.state.lastPage;
  const [reqTodos, setReqTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [finishedTodos, setFinishedTodos] = useState([]);
  const [unfinishedTodos, setUnfinishedTodos] = useState([]);
  function openModal() {
    document.getElementsByClassName("modalBackground")[0].style.visibility =
      "visible";
    document.getElementsByClassName("modal")[0].style.opacity = "100";
  }
  function loadData() {
    setLoading(true);
    firebaseApp
      .firestore()
      .collection("todos")
      .where("user", "==", firebaseApp.auth().currentUser.uid)
      .where("time", "==", toDisplay)
      .orderBy("priority", "desc")
      .get()
      .then((snap) => {
        snap.docs.map((each) => {
          let eachdict = {
            id: each.id,
            taskName: each.get("taskName"),
            taskDesc: each.get("taskDesc"),
            priority: each.get("priority"),
          };
          if (each.get("finished")) {
            finishedTodos.push(eachdict);
          } else {
            unfinishedTodos.push(eachdict);
          }
        });
        setLoading(false);
      });
  }
  useEffect(() => {
    loadData();
  }, []);
  console.log(allTodos);
  return !loading ? (
    <div className="allTodos">
      <NewTodoModal toDisplay={toDisplay} />
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
            <span className="toDisplay">{toDisplay}</span>
            <IconButton onClick={() => openModal()} title="New Todo">
              <QueueIcon />
            </IconButton>
          </div>
          <div className="mainTodos">
            <div className="unfinishedTodos">
              <div className="noUnfinished noTodos">
                {unfinishedTodos.length} unfinished
              </div>
            </div>
            <div className="finishedTodos">
              <div className="noFinished noTodos">
                {finishedTodos.length} finished
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
