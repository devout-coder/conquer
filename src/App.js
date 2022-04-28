import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import Daily from "./Components/Daily/Daily";
import firebaseApp from "./firebase";
import Loading from "./Components/Loading/Loading";
import { useEffect, useState } from "react";
import PrivateRoute from "./PrivateRoute";
import ClosedRoute from "./ClosedRoute";
import Week from "./Components/Week/Week";
import Month from "./Components/Month/Month";
import Year from "./Components/Year/Year";
import LongTerm from "./Components/LongTerm/LongTerm";
import { loadingContext } from "./loadingContext";
import AllTodos from "./Components/AllTodos/AllTodos";
import Friends from "./Components/Friends/Friends";

//this component handles all the routes
function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      //this function observes the state of authentication...returns none if user doesnt exist..returns true if the user exist..and returns false if the user is being created or loaded..
      setFirebaseInitialized(user); //setting that user to predefined state
    });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        {/* passing the auth status in context provider */}
        <loadingContext.Provider value={firebaseInitialized}>
          <Switch>
            <ClosedRoute exact path="/" component={Landing} />
            <ClosedRoute exact path="/signup" component={Signup} />
            <ClosedRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/daily" component={Daily} />
            <PrivateRoute exact path="/daily" component={Daily} />
            <PrivateRoute exact path="/week" component={Week} />
            <PrivateRoute exact path="/month" component={Month} />
            <PrivateRoute exact path="/year" component={Year} />
            <PrivateRoute exact path="/longTerm" component={LongTerm} />
            <PrivateRoute exact path="/:time/allTodos" component={AllTodos} />
            <PrivateRoute exact path="/friends" component={Friends} />
          </Switch>
        </loadingContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
