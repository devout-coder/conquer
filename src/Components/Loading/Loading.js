import { CircularProgress } from "@material-ui/core";
import React from "react";
import "./Loading.css";

function Loading() {
  return (
    <div className="loading">
      <div className="actualLoading">
        <CircularProgress />
        <div className="loadingText">Loading...</div>
      </div>
    </div>
  );
}

export default Loading;
