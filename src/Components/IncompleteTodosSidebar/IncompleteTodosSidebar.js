import React, { useEffect, useState } from "react";
import firebaseApp from "../../firebase";

function IncompleteTodosSidebar(props) {
  const [reqTodos, setReqTodos] = useState([]);
  
  function loadReqTodos() {
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
      });
  }
  useEffect(() => {
    loadReqTodos();
  }, []);
  console.log(reqTodos);
  return <div></div>;
}

export default IncompleteTodosSidebar;
