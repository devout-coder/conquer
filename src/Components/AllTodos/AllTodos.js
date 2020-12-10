import { IconButton } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./AllTodos.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import QueueIcon from "@material-ui/icons/Queue";
import NewTodoModal from "../NewTodoModal/NewTodoModal";

function AllTodos(props) {
  const history = useHistory();
  const location = useLocation();
  const toDisplay = location.state.toDisplay;
  const lastPage = location.state.lastPage;
  function openModal() {
    document.getElementsByClassName("modalBackground")[0].style.visibility =
      "visible";
    document.getElementsByClassName("modal")[0].style.opacity = "100";
  }
  return (
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
            <span className="toDisplay">
              {toDisplay}
            </span>
            <IconButton onClick={() => openModal()} title="New Todo" >
              <QueueIcon />
            </IconButton>
          </div>
          {/* <div className="mainTodos">
            <div className="finishedTodos"></div>
            <div className="unfinishedTodos "></div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AllTodos;
