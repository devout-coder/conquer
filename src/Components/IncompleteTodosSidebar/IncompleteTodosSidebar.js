import React, { useEffect, useState } from "react";
import firebaseApp from "../../firebase";
import "./IncompleteTodosSidebar.css";
import Loading from "../Loading/Loading";
 
function IncompleteTodosSidebar(props) {
  const [reqTodos, setReqTodos] = useState([]);
  const [loading, setLoading] = useState(false);

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
  console.log(reqTodos);
  return (
    <div className="incompleteTodosSidebar">
      {loading ? (
        <Loading />
      ) : (
        <div className="noIncompleteTodos">
          {" "}
          {reqTodos.length} incomplete tasks{" "}
        </div>
      )}
    </div>
  );
}

export default IncompleteTodosSidebar;
