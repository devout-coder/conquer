import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import Loading from "./Components/Loading/Loading";
import { loadingContext } from "./loadingContext";

function ClosedRoute(props) {
  const user = useContext(loadingContext);
  return (
    <Route
      path={props.path}
      render={(data) =>
        user == null ? ( //if the user is logged in he is redirected to daily page...
          <props.component {...data}></props.component>
        ) : user == false ? (
          <Loading />
        ) : (
          //else he remains on that route
          <Redirect to={{ pathname: "/daily" }}></Redirect>
        )
      }
    ></Route>
  );
}

export default ClosedRoute;
