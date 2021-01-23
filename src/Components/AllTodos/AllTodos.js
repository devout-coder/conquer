import { Checkbox, IconButton } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
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
import YearPicker from "../YearPicker/YearPicker";
import IncompleteTodosSidebar from "../IncompleteTodosSidebar/IncompleteTodosSidebar";
import { loadingContext } from "../../loadingContext";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function AllTodos() {
  const user = useContext(loadingContext);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const location = useLocation(); //holds props
  const [time, setTime] = useState(location.state.time); //this holds the date/month/week/year of which the user wants all todos
  const lastPage = location.state.lastPage; //this holds daily/weekly/monthly/yearly basically the type of time wanted
  const [finishedTodos, setFinishedTodos] = useState([]);
  const [unfinishedTodos, setUnfinishedTodos] = useState([]);
  //finished and unfinished todos get updated when i use loadData func
  const [expandTaskId, setExpandTaskId] = useState("");
  const [expandTaskName, setExpandTaskName] = useState("");
  const [expandTaskDesc, setExpandTaskDesc] = useState("");
  const [expandTaskPri, setExpandTaskPri] = useState("0");
  //if any specific todo is clicked, all these expandTask details will be passed as a prop to the modal
  const [openTodoModal, setOpenTodoModal] = useState(false);
  //whenever this is true modal with required props is rendered

  function loadData() {
    //this function fetches todos from firebase of the specific time, distinguishes them as finished and unfinished and stores them in state variables
    firebaseApp
      .firestore()
      .collection("todos")
      .where("user", "==", firebaseApp.auth().currentUser.uid)
      .where("time", "==", time)
      .orderBy("priority", "desc")
      .onSnapshot((snap) => {
        setLoading(true);
        //i know it seems silly to setLoading true and false one after another... i don't why but if i don't do that then unwanted tasks get ticked...
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
            timeType: each.get("timeType"),
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
        setLoading(false);
      });
  }
  function replaceDate(date) {
    //this func takes date and removes the space and year from it...
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
    if (user) {
      loadData();
    } else {
      setLoading(true);
    }
  }, [time, user]); //passed time here so that in yearly todos when i update the year data gets loaded again..

  return (
    <div className="allTodos">
      {openTodoModal ? (
        <NewTodoModal
          time={time}
          shouldReload={() => loadData()}
          openTodoModal={(shouldOpen) => setOpenTodoModal(shouldOpen)}
          //this function can change the state which controls opening and closing of modal
          taskId={expandTaskId}
          taskName={expandTaskName}
          taskDesc={expandTaskDesc}
          taskPri={expandTaskPri}
          lastPage={lastPage}
        />
      ) : (
        <div></div>
      )}
      <Navbar />
      <div className="allTodosPage">
        <Sidebar />
        <div
          className={
            lastPage == "year"
              ? "allTodosPageEmpty thisIsYear"
              : lastPage == "longTerm"
              ? "allTodosPageEmpty thisIsLongTerm"
              : "allTodosPageEmpty"
          }
        >
          <div className="allTodosCont">
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
              {lastPage != "year" ? (
                <span className="time">{replaceDate(time)}</span>
              ) : (
                <div className="modifiedYearPicker">
                  <YearPicker
                    year={time}
                    changeYear={(year) => setTime(year)}
                  />
                </div>
              )}
              <IconButton onClick={() => expandBlankTodo()} title="New Todo">
                <QueueIcon />
              </IconButton>
            </div>
            {loading ? (
              <Loading />
            ) : unfinishedTodos.length != 0 || finishedTodos.length != 0 ? (
              <DragDropContext>
                <div className="mainTodos">
                  {unfinishedTodos.length != 0 ? (
                    <div className="unfinishedTodos">
                      <div className="noUnfinished noTodos">
                        {unfinishedTodos.length} unfinished
                      </div>
                      <Droppable droppableId="unfinishedTodosList">
                        {(provided) => (
                          <div
                            className="unfinishedTodosList"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {unfinishedTodos.map((each, index) => (
                              <EachTodo
                                id={each.id}
                                key={each.id}
                                index={index}
                                priority={each.priority}
                                taskName={each.taskName}
                                taskDesc={each.taskDesc}
                                finished={each.finished}
                                time={each.time}
                                timeType={each.timeType}
                                startLoading={() => loadData()}
                                activateLoader={(shouldLoad) =>
                                  setLoading(shouldLoad)
                                }
                                expandTodo={(id, taskName, taskDesc, taskPri) =>
                                  expandTodo(id, taskName, taskDesc, taskPri)
                                }
                                sidebarTodo={false}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {finishedTodos.length != 0 ? (
                    <div className="finishedTodos">
                      <div className="noFinished noTodos">
                        {finishedTodos.length} finished
                      </div>
                      <Droppable droppableId="finishedTodosList">
                        {(provided) => (
                          <div
                            className="finishedTodosList"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {finishedTodos.map((each, index) => (
                              <EachTodo
                                id={each.id}
                                key={each.id}
                                index={index}
                                priority={each.priority}
                                taskName={each.taskName}
                                taskDesc={each.taskDesc}
                                finished={each.finished}
                                time={each.time}
                                timeType={each.timeType}
                                startLoading={() => loadData()}
                                activateLoader={(shouldLoad) =>
                                  setLoading(shouldLoad)
                                }
                                expandTodo={(id, taskName, taskDesc, taskPri) =>
                                  expandTodo(id, taskName, taskDesc, taskPri)
                                }
                                sidebarTodo={false}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </DragDropContext>
            ) : (
              //this is rendered if the length of both finished and unfinished todos is 0
              <div className="noTodosMessage">No tasks added yet!</div>
            )}
          </div>
          {lastPage == "year" ? (
            <IncompleteTodosSidebar timeType="year" />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllTodos;
