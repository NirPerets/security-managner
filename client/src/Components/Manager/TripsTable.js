import { Component } from "react";
import Search from "./Search";
import { Link } from 'react-router-dom'
import TripModal from "./tripModal";
import Loading from "../Loading";
import checkTripActive from "../Functions/checkTripActive";

class TripsTable extends Component {

    state = {
        trips: null,
        tripOnModal: null,
    }

    callUser = async () => {
        const response = await fetch(('/user/' + localStorage.getItem('user')), { headers: {"x-access-token" : localStorage.getItem('token')} });
        const data = await response.json()
        
        this.setState({
            trips: data.user.trips,
        })
    }

    getTrips = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "x-access-token" : localStorage.getItem('token')}
        }

        const response = await fetch(('/user/' + localStorage.getItem('user')) + '/getTrips', requestOptions);
        const data = await response.json()

        this.setState({
            trips: data,
        })
    }

    componentDidMount() {
        this.getTrips()
    }

    setModal = (item) => {
        this.setState({tripOnModal : item})
    }

    closeModal = () => {
        this.setState({tripOnModal : null})
    }

    render() {

        if(this.state.trips == null) {
            return (
                <div className="loading-container">
                    <Loading />
                </div>
            )
        }

        if(this.state.tripOnModal != null) {
            return(
                <div className="fade">
                    <div className="page-heading">
                        <h1>רשימת טיולים</h1>
                        <Link to="/manager/newTrip">הוסף טיול</Link>
                    </div>
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>גוף מוציא טיול</th>
                                <th>עיר</th>
                                <th>תאריך יציאה</th>
                                <th>תאריך סיום</th>
                                <th>שעת התייצבות</th>
                                <th>מאבטחים</th>
                                <th>חובשים</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.trips.map(item => {
                                    return(
                                        <tr onClick={() => this.setModal(item)}>
                                            <td>{ item.body + " " + item.class }</td>
                                            <td>{ item.city }</td>
                                            <td>{ item.startDate }</td>
                                            <td>{ item.finishDate }</td>
                                            <td>{ item.hour }</td>
                                            <td>{ item.guards.length }</td>
                                            <td>{ item.medics.length }</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <div className={"modal-container " + (this.state.tripOnModal != null ? 'show' : '')}>
                        <TripModal closeModal={ this.closeModal } trip={ this.state.tripOnModal } />
                    </div>
                </div>
            )
        } else {
            return(
                <div className="fade">
                    <div className="page-heading">
                        <h1>רשימת טיולים</h1>
                        <Link to="/manager/newTrip">הוסף טיול</Link>
                    </div>
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>גוף מוציא טיול</th>
                                <th>עיר</th>
                                <th>תאריך יציאה</th>
                                <th>תאריך סיום</th>
                                <th>שעת התייצבות</th>
                                <th>מאבטחים</th>
                                <th>חובשים</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.trips.map(item => {
                                    return(
                                        <tr className={ item.status ? 'active' : ''} onClick={() => this.setModal(item)}>
                                            <td>{ item.body + " " + item.class }</td>
                                            <td>{ item.city }</td>
                                            <td>{ item.startDate }</td>
                                            <td>{ item.finishDate }</td>
                                            <td>{ item.hour }</td>
                                            <td>{ item.guards.length }</td>
                                            <td>{ item.medics.length }</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}

export default TripsTable