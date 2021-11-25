import { Component } from 'react'
import MiniTable from '../../MiniTable';
import NextTrip from './NextTrip'
import Loading from "../../Loading";
import HomeTrips from './homeTrips';
import HomeWorkers from './homeWorkers';
import Statistics from './Statistics';
import FreeMedics from './freeMedics';
import FreeGuards from './freeGuards';
import checkTripActive from '../../Functions/checkTripActive';

class Home extends Component {

    constructor() {
        super()
    }

    state = {
        trips: null,
        guards: null,
        medics: null,
        freeMedicsCount: 0,
        freeGuardsCount: 0,
        user: null,
        activeTrips: 0,
    }

    callUser = async () => {
        const userResponse = await (
            await fetch(('/user/' + localStorage.getItem('user')),
            { 
                headers: {
                    "x-access-token" : localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                } 
            })
            ).json();
        const tripsResponse = await (await fetch(('/user/' + localStorage.getItem('user')) + '/getTrips', { headers: {"x-access-token" : localStorage.getItem('token'), 'Content-Type': 'application/json','Accept': 'application/json'}})).json();
        const workerResponse = await (await fetch(('/user/' + localStorage.getItem('user')) + '/getWorkers', { headers: {"x-access-token" : localStorage.getItem('token'), 'Content-Type': 'application/json','Accept': 'application/json'}})).json();

        let tempGuards = []
        let tempMedics = []

        let freeGuardsCount = 0;
        let freeMedicsCount = 0;
        let tempActiveTripsCount = 0;

        await workerResponse.forEach(worker => {
            if(worker.job == 'guard') {
                tempGuards.push(worker)
                if(!worker.status) freeGuardsCount++
            }
            else if (worker.job == 'medic') {
                tempMedics.push(worker)
                if(!worker.status) freeMedicsCount++
            }
            else if (worker.job == 'double') {
                tempGuards.push(worker)
                tempMedics.push(worker)
                if(!worker.status) {
                    freeMedicsCount++
                    freeGuardsCount++
                }
            }
        });

        await tripsResponse.forEach(trip => {
            if (checkTripActive(trip.startDate, trip.finishDate)) tempActiveTripsCount++
        })
        
        this.setState({
            trips: tripsResponse,
            guards: tempGuards,
            medics: tempMedics,
            user: userResponse,
            freeMedicsCount: freeMedicsCount,
            freeGuardsCount: freeGuardsCount,
            activeTrips: tempActiveTripsCount
        })
    }

    async componentDidMount() {
        await this.callUser()
        console.log(this.state.trips)
    }

    checkMobile = async () => {
        const check = await fetch(('/user/' + localStorage.getItem('user') + '/checkMobile'), { headers: {"x-access-token" : localStorage.getItem('token')} })
        const data = await check.json()
    }

    render() {
        if(this.state.trips == null || this.state.guards == null) {
            return (
                <div className="loading-container">
                    <Loading />
                </div>
            )
        }
        
        return(
            <div className="home-page fade">
                <Statistics guardCount = { this.state.guards.length } medicCount = { this.state.medics.length } tripCount = { this.state.trips.length } activeTrips = { this.state.activeTrips }/>

                <div className="double">
                    <FreeMedics count = { this.state.medics.length } freeCount = { this.state.freeMedicsCount } />
                    <FreeGuards count = { this.state.guards.length } freeCount = { this.state.freeGuardsCount } />
                    <HomeWorkers guards={ this.state.guards } medics={ this.state.medics } title="עובדי החברה" />
                </div>

                <div className="double">
                    <HomeTrips trips={ this.state.trips } title="טיולים אחרונים"/>
                    <NextTrip trip={ this.state.trips[0] }/>
                </div>
                <button onClick={ this.checkMobile }>בדיקה בדיקה</button>
            </div>
        )
    }
}

export default Home