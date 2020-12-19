import React from "react";
import { Redirect, Route } from "react-router-dom";
import firebaseApp from "./firebase";

function ClosedRoute(props) {
  return (
    <Route
      path={props.path}
      render={(data) =>
        firebaseApp.auth().currentUser ? ( //if the user is logged in he is redirected to daily page...
          <Redirect to={{ pathname: "/daily" }}></Redirect>
        ) : (
          //else he remains on that route
          <props.component {...data}></props.component>
        )
      }
    ></Route>
  );
}

export default ClosedRoute;
