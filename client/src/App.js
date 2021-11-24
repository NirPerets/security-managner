import React, { useEffect, Component } from 'react';
import Manager from './Components/Manager/Manager';
import WorkerConsole from './Components/workerConsole/WorkerConsole';
import Login from './Components/Login/Login'
import Register from './Components/Login/Register';
import {BrowserRouter as Router, Switch, Route}  from 'react-router-dom'
import { axiosInstance } from './config'

import TripsTable from "./Components/Manager/TripsTable";
import Sidebar from "./Components/Manager/Sidebar";
import WorkersList from './Components/Manager/WorkerList'
import TopHeader from "./Components/TopHeader";
import NewTrip from "./Components/Manager/newTrip";
import Home from "./Components/Manager/Home/Home";

import './style.scss';

class App extends Component {
  constructor() {
    super()
  }

  state = {
    isLoggedIn: false,
    user: {}
  }

  componentDidMount() {
    //this.checkLoginStatus()
  }

  checkLoginStatus = async () => {
    const response = await fetch('/logged_in', { headers: {"x-access-token" : localStorage.getItem('token')} });
    if(response.status != 200) {
      window.location.replace('/login')
    }
  }

  setUser = (user) => {
    localStorage.setItem('user', user._id)
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
              <Route exact path="/">
                <Login setUser={this.setUser} />
              </Route>
              <Route path="/login">
                <Login setUser={this.setUser} />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/manager/:type">
                <Manager User={ this.state.user } />
              </Route>
              <Route path="/worker">
                <WorkerConsole User={ this.state.user }/>
              </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
