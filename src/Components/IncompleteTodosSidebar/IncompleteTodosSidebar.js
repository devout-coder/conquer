import React, { useEffect, useState } from "react";
import firebaseApp from "../../firebase";
import "./IncompleteTodosSidebar.css";
import Loading from "../Loading/Loading";
import EachTodo from "../EachTodo/EachTodo";
import NewTodoModal from "../NewTodoModal/NewTodoModal";

function IncompleteTodosSidebar(props) {
  const [reqTodos, setReqTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandTaskId, setExpandTaskId] = useState("");
  const [expandTaskName, setExpandTaskName] = useState("");
  const [expandTaskDesc, setExpandTaskDesc] = useState("");
  const [expandTaskPri, setExpandTaskPri] = useState("0");
  const [expandTaskTime, setExpandTaskTime] = useState("");
  const [expandTaskTimeType, setExpandTaskTimeType] = useState("");
  //if any specific todo is clicked, all these expandTask details will be passed as a prop to the modal
  const [openTodoModal, setOpenTodoModal] = useState(false);
  //whenever this is true modal with required props is rendered

  function loadReqTodos() {
    setLoading(true);
    firebaseApp
      .firestore()
      .collection("todos")
      .where("user", "==", firebaseApp.auth().currentUser.uid)
      .where("timeType", "==", props.timeType)
      .orderBy("priority", "desc")
      .get()
      .then((snap) => {
        let tparray = [];
        snap.docs.map((each) => {
          let eachdict = {
            id: each.id,
            taskName: each.get("taskName"),
            taskDesc: each.get("taskDesc"),
            priority: each.get("priority"),
            finished: each.get("finished"),
            time: each.get("time"),
          };
          if (!each.get("finished")) {
            tparray.push(eachdict);
          }
        });
        setReqTodos(tparray);
        setLoading(false);
      });
  }
  useEffect(() => {
    loadReqTodos();
  }, []);
  // console.log(reqTodos);

  function expandTodo(id, taskName, taskDesc, taskPri, taskTime, taskTimeType) {
    //this function uses the parameters given by the particular todo triggering this function and sets those parameters equal to the state..then the modal is opened with these states as props
    setExpandTaskName(taskName);
    setExpandTaskDesc(taskDesc);
    setExpandTaskPri(taskPri);
    setExpandTaskId(id);
    setExpandTaskTime(taskTime);
    setExpandTaskTimeType(taskTimeType);
    setOpenTodoModal(true);
  }

  return (
    <div
      className={
        reqTodos.length == 0
          ? "incompleteTodosSidebar emptySidebar"
          : "incompleteTodosSidebar"
      }
    >
      {openTodoModal ? (
        <NewTodoModal
          time={expandTaskTime}
          shouldReload={() => loadReqTodos()}
          openTodoModal={(shouldOpen) => setOpenTodoModal(shouldOpen)}
          //this function can change the state which controls opening and closing of modal
          taskId={expandTaskId}
          taskName={expandTaskName}
          taskDesc={expandTaskDesc}
          taskPri={expandTaskPri}
          lastPage={expandTaskTimeType}
        />
      ) : (
        <div></div>
      )}
      {loading ? (
        <Loading />
      ) : reqTodos.length == 0 ? (
        <div className="noTodosMessage">No incomplete tasks!</div>
      ) : (
        <div className="incompleteTodosCont">
          <div className="noIncompleteTodos">
            {reqTodos.length != 1
              ? `${reqTodos.length} incomplete tasks`
              : `${reqTodos.length} incomplete task`}
          </div>
          <div className="inCompleteTodos">
            {reqTodos.map((each) => (
              <EachTodo
                id={each.id}
                priority={each.priority}
                taskName={each.taskName}
                taskDesc={each.taskDesc}
                finished={each.finished}
                time={each.time}
                timeType={each.timeType}
                startLoading={() => loadReqTodos()}
                // activateLoader={(shouldLoad) => setLoading(shouldLoad)}
                expandTodo={(
                  id,
                  taskName,
                  taskDesc,
                  taskPri,
                  taskTime,
                  taskTimeType
                ) =>
                  expandTodo(
                    id,
                    taskName,
                    taskDesc,
                    taskPri,
                    taskTime,
                    taskTimeType
                  )
                }
                sidebarTodo={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default IncompleteTodosSidebar;
