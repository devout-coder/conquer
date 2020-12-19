import React from "react";
import { Redirect, Route } from "react-router-dom";
import firebaseApp from "./firebase";

function PrivateRoute(props) {
  return (
    <Route
      path={props.path}
      render={(data) =>
        firebaseApp.auth().currentUser ? ( //if the user exists the componetn is rendered...
          <props.component {...data}></props.component>
        ) : ( //else the user is redirected to login page
          <Redirect to={{ pathname: "/login" }}></Redirect>
        )
      }
    ></Route>
  );
}

export default PrivateRoute;
