import React from "react";
import { Redirect, Route } from "react-router-dom";
import firebaseApp from "./firebase";

function PrivateRoute(props) {
  return (
    <Route
      path={props.path}
      render={(data) =>
        firebaseApp.auth().currentUser ? (
          <props.component {...data}></props.component>
        ) : (
          <Redirect to={{ pathname: "/login" }}></Redirect>
        )
      }
    ></Route>
  );
}

export default PrivateRoute;
