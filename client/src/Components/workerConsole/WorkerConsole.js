import { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import WorkerInfo from './WorkerInfo'
import NextTrip from "../Manager/Home/NextTrip";
import Loading from '../Loading'
import WorkerStatistics from "./WorkerStatistics";

class WorkerConsole extends Component {
    
    state = {
        worker: null,
        trips: null,
        loading: false,
    }
    
    getWorkerInfo = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await fetch(('/worker/' + localStorage.getItem('worker')), requestOptions);
        const data = await response.json();
    
        if (response.status !== 200) {
          throw Error(data) 
        }

        this.setState({ worker : data.worker, trips : data.trips })
    }

    componentDidMount() {
        this.getWorkerInfo()
    }

    render() {

        if ( this.state.worker === null) {
            return(
                <div className="loading-container">
                    <Loading />
                </div>
            )
        } else {
            return(
                <>
                    <div className="worker-console">
                        <WorkerStatistics worker={ this.state.worker } />
                        <div className="double">
                            <WorkerInfo worker={ this.state.worker } trips={ this.state.trips }/>
                            <NextTrip worker = { this.state.worker } trip={ this.state.trips[0] } />
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default WorkerConsole;