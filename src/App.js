import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import Daily from "./Components/Daily/Daily";
import Notes from "./Components/Notes/Notes";
import firebaseApp from "./firebase";
import Loading from "./Components/Loading/Loading";
import { useEffect, useState } from "react";
import PrivateRoute from "./PrivateRoute";
import ClosedRoute from "./ClosedRoute";
import Week from "./Components/Week/Week";
import Month from "./Components/Month/Month";
import Year from "./Components/Year/Year";
import LongTerm from "./Components/LongTerm/LongTerm";
import VisionBoard from "./Components/VisionBoard/VisionBoard";
import { loadingContext } from "./loadingContext";
import AllTodos from "./Components/AllTodos/AllTodos";

function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      setFirebaseInitialized(user);
    });
  }, []);
  return firebaseInitialized != false ? (
    <div className="App">
      <BrowserRouter>
        <loadingContext.Provider value= {firebaseInitialized} >
          <Switch>
            <ClosedRoute exact path="/" component={Landing} />
            <ClosedRoute exact path="/signup" component={Signup} />
            <ClosedRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/daily" component={Daily} />
            <PrivateRoute exact path="/notes" component={Notes} />
            <PrivateRoute exact path="/daily" component={Daily} />
            <PrivateRoute exact path="/week" component={Week} />
            <PrivateRoute exact path="/month" component={Month} />
            <PrivateRoute exact path="/year" component={Year} />
            <PrivateRoute exact path="/longTerm" component={LongTerm} />
            <PrivateRoute exact path="/visionBoard" component={VisionBoard} />
            <PrivateRoute exact path="/:time/allTodos" component={AllTodos} />
          </Switch>
        </loadingContext.Provider>
      </BrowserRouter>
    </div>
  ) : (
    <Loading />
  );
}

export default App;
