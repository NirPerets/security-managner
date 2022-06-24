import React, { useEffect, useState } from "react";
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom'
import Sidebar from "./Sidebar";
import TripsTable from "./TripsTable";
import WorkersList from './WorkerList'
import TopHeader from "../TopHeader";
import NewTrip from "./newTrip";
import Home from "./Home/Home";
import checkLoginStatus from "../Functions/checkLoginStatus";

const Manager = props => {

  const [user, setUser] = useState(props)
  const { type } = useParams()

  useEffect(async () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "x-access-token" : localStorage.getItem('token') },
    };
    const response = await fetch('/logged_in', requestOptions);
    if(response.status != 200) {
        window.location.replace('/login')
    }
  });

  return(
      <>
        <div className="manager-console">
            <Sidebar />
            <div className="main-content">
                <div className="container">
                    {type === '/' && <Home User={user} />}
                    {type === 'home' && <Home User={user} />}
                    {type === 'trips' && <TripsTable User={user} />}
                    {type === 'newTrip' && <NewTrip User={user} />}
                    {type === 'workers' && <WorkersList User={user} />}
                </div>
            </div>
        </div>
      </>
  )
}

export default Manager;

/*
                        <Switch>
                            <Route path={ path + '/'}>
                                <Home User={user} />
                            </Route>
                            <Route path={ path + '/home' }>
                                <Home User={user} />
                            </Route>
                            <Route path={'${path}/trips'}>
                                <TripsTable User={user} />
                            </Route>
                            <Route path="/newTrip">
                                <NewTrip User={user} />
                            </Route>
                            <Route path="/workers">
                                <WorkersList User={user} />
                            </Route>
                            <Route path="/settings">

                            </Route>
                        </Switch>
*/