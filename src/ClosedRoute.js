import React from "react";
import { Redirect, Route } from "react-router-dom";
import firebaseApp from "./firebase";

function ClosedRoute(props) {
  return (
    <Route
      path={props.path}
      render={(data) =>
        firebaseApp.auth().currentUser ? (
          <Redirect to={{ pathname: "/daily" }}></Redirect>
        ) : (
          <props.component {...data}></props.component>
        )
      }
    ></Route>
  );
}

export default ClosedRoute;
