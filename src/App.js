import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './Components/Landing/Landing';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
