import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './Components/Landing/Landing';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
