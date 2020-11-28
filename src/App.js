import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import Daily from "./Components/Daily/Daily";
import firebaseApp from "./firebase";
import Loading from "./Components/Loading/Loading";
import { useEffect, useState } from "react";

function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(user=>{
        setFirebaseInitialized(user)
    })
  }, []);
  return firebaseInitialized !=false?(
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/daily" component={Daily} />
        </Switch>
      </BrowserRouter>
    </div>
  ):(
    <Loading/>
  )
}

export default App;