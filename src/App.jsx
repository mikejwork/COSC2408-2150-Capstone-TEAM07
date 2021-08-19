import React, { useContext } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import { AuthContext } from "./contexts/AuthContext";

import Home from './components/Home'
import Login from './components/Login'
import Profile from './components/Profile'
import Channels from './components/Channels'
import Navigation from './components/Navigation'

function App() {
  const context = useContext(AuthContext)
  return (
      <Router>
          <Navigation/>
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>

            <Route exact path="/login">
              <Login/>
            </Route>

            <Route exact path="/channels">
              <Channels/>
            </Route>

            <Route exact path="/profile">
              <Profile/>
            </Route>
          </Switch>
      </Router>
  );
}

export default App;
