import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import Loading from "./Components/Loading/Loading";
import { loadingContext } from "./loadingContext";

function PrivateRoute(props) {
  const user = useContext(loadingContext);
  return (
    <Route
      path={props.path}
      render={(data) =>
        user != null ? ( //if the user exists the componetn is rendered...
          <props.component {...data}></props.component>
        ) : user == false ? (
          <Loading />
        ) : (
          //else the user is redirected to login page
          <Redirect to={{ pathname: "/login" }}></Redirect>
        )
      }
    ></Route>
  );
}

export default PrivateRoute;
