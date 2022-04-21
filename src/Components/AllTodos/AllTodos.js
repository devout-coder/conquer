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
  const timeType = location.state.timeType; //this holds daily/weekly/monthly/yearly basically the type of time wanted
  const [finishedTodos, setFinishedTodos] = useState([]);
  const [unfinishedTodos, setUnfinishedTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  //finished and unfinished todos get updated when i use loadData func

  const [expandTask, setExpandTask] = useState(null);
  //if any specific todo is clicked, all these expandTask details will be passed as a prop to the modal

  const [openTodoModal, setOpenTodoModal] = useState(false);
  //whenever this is true modal with required props is rendered

  function loadData() {
    //this function fetches todos from firebase of the specific time, distinguishes them as finished and unfinished and stores them in state variables
    firebaseApp
      .firestore()
      .collection("todos")
      .where("users", "array-contains", user.uid)
      .where("time", "==", time)
      .orderBy("priority", "desc")
      .get()
      .then((snap) => {
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
            timesPostponed: each.get("timesPostponed"),
            index: each.get("index"),
            users: each.get("users"),
          };
          if (each.get("finished")) {
            //each doc in todos collection of firebase is added to either finished or unfinished list based on its finished status
            finished.push(eachdict);
          } else {
            unfinished.push(eachdict);
          }
        });

        let all = [...unfinished, ...finished];

        setFinishedTodos(
          finished.sort((a, b) => {
            return a.index[user.uid] - b.index[user.uid];
          })
        );
        setUnfinishedTodos(
          unfinished.sort((a, b) => {
            return a.index[user.uid] - b.index[user.uid];
          })
        );
        setAllTodos(
          all.sort((a, b) => {
            return a.index[user.uid] - b.index[user.uid];
          })
        );
        setLoading(false);
      });
  }

  function replaceDate(date) {
    //this func takes date and removes the space and year from it...
    return date.replace(/\s\d{4}/g, "");
  }

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(true);
    }
  }, [time, user]); //passed time here so that in yearly todos when i update the year data gets loaded again..

  function rearrangeList(props) {
    //this func deals with changes the todo position on drag end and also saves the positions in firebase
    if (props.destination != null) {
      //this is evaluated true if drag isn't outside the draggable
      let initialPos = props.source.index;
      let finalPos = props.destination.index;
      let initialPosAllTodos;
      let finalPosAllTodos;

      let initialTaskPri = allTodos[initialPos].priority;
      let finalTaskPri = allTodos[finalPos].priority;

      if (initialTaskPri == finalTaskPri) {
        //this condition ensures that item will be dropped only its interchanged with items of same priority

        unfinishedTodos.splice(
          finalPos,
          0,
          unfinishedTodos.splice(initialPos, 1)[0]
        );
        //splices removes the element from intial position and pastes it in new position

        allTodos.forEach((each) => {
          if (each.id == unfinishedTodos[finalPos].id) {
            finalPosAllTodos = each.index[user.uid];
          } else if (each.id == unfinishedTodos[initialPos].id) {
            initialPosAllTodos = each.index[user.uid];
          }
        });

        if (initialPosAllTodos < finalPosAllTodos) {
          allTodos.forEach((each, index) => {
            let indexDict = each.index;
            if (index == initialPosAllTodos) {
              indexDict[user.uid] = finalPosAllTodos;
              firebaseApp
                .firestore()
                .collection("todos")
                .doc(each.id)
                .update({
                  index: indexDict,
                })
                .catch((error) => console.error(error));
            }
            if (index > initialPosAllTodos && index <= finalPosAllTodos) {
              indexDict[user.uid] = indexDict[user.uid] - 1;
              firebaseApp
                .firestore()
                .collection("todos")
                .doc(each.id)
                .update({
                  index: indexDict,
                })
                .catch((error) => console.error(error));
            }
          });
        } else if (initialPosAllTodos > finalPosAllTodos) {
          allTodos.forEach((each, index) => {
            let indexDict = each.index;
            if (index == initialPosAllTodos) {
              indexDict[user.uid] = finalPosAllTodos;
              firebaseApp
                .firestore()
                .collection("todos")
                .doc(each.id)
                .update({
                  index: indexDict,
                })
                .catch((error) => console.error(error));
            }
            if (index < initialPosAllTodos && index >= finalPosAllTodos) {
              indexDict[user.uid] = indexDict[user.uid] + 1;
              firebaseApp
                .firestore()
                .collection("todos")
                .doc(each.id)
                .update({
                  index: indexDict,
                })
                .catch((error) => console.error(error));
            }
          });
        }
      }
    }
  }

  // allTodos.forEach((todo) => {
  //   console.log(todo.taskName, todo.index);
  // });

  return (
    <div className="allTodos">
      {openTodoModal ? (
        <NewTodoModal
          task={
            expandTask == null ? { time: time, timeType: timeType } : expandTask
          }
          setTask={setExpandTask}
          shouldReload={() => loadData()}
          openTodoModal={(shouldOpen) => setOpenTodoModal(shouldOpen)}
        />
      ) : (
        <div></div>
      )}
      <Navbar />
      <div className="allTodosPage">
        <Sidebar />
        <div
          className={
            timeType == "year"
              ? "allTodosPageEmpty thisIsYear"
              : timeType == "longTerm"
              ? "allTodosPageEmpty thisIsLongTerm"
              : "allTodosPageEmpty"
          }
        >
          <div className="allTodosCont">
            <div className="topbar">
              {timeType != "longTerm" && timeType != "year" ? (
                <IconButton
                  title="Back"
                  onClick={() => history.push(`/${timeType}`)}
                >
                  <ArrowBackIcon />
                </IconButton>
              ) : (
                <div></div>
              )}
              {timeType != "year" ? (
                <span className="time">{replaceDate(time)}</span>
              ) : (
                <div className="modifiedYearPicker">
                  <YearPicker
                    year={time}
                    changeYear={(year) => setTime(year)}
                  />
                </div>
              )}
              <IconButton
                onClick={() => setOpenTodoModal(true)}
                title="New Todo"
              >
                <QueueIcon />
              </IconButton>
            </div>
            {loading ? (
              <Loading />
            ) : unfinishedTodos.length != 0 || finishedTodos.length != 0 ? (
              <div className="mainTodos">
                <DragDropContext
                  onDragEnd={(props) => {
                    rearrangeList(props);
                  }}
                >
                  {unfinishedTodos.length != 0 ? (
                    <div className="unfinishedTodos">
                      <div className="noUnfinished noTodos">
                        {unfinishedTodos.length} unfinished
                      </div>
                      <Droppable droppableId="unfinishedTodos">
                        {(provided) => (
                          <div
                            className="unfinishedTodosList"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {unfinishedTodos.map((each) => (
                              <EachTodo
                                key={each.id}
                                task={each}
                                startLoading={() => loadData()}
                                expandTodo={(task) => {
                                  setExpandTask(task);
                                  setOpenTodoModal(true);
                                }}
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
                </DragDropContext>
                {finishedTodos.length != 0 ? (
                  <div className="finishedTodos">
                    <div className="noFinished noTodos">
                      {finishedTodos.length} finished
                    </div>
                    <div className="finishedTodosList">
                      {finishedTodos.map((each) => (
                        <EachTodo
                          key={each.id}
                          task={each}
                          startLoading={() => loadData()}
                          expandTodo={(task) => {
                            setExpandTask(task);
                            setOpenTodoModal(true);
                          }}
                          sidebarTodo={false}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ) : (
              //this is rendered if the length of both finished and unfinished todos is 0
              <div className="noTodosMessage">No tasks added yet!</div>
            )}
          </div>
          {timeType == "year" ? (
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
