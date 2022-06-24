import { Component } from "react";
import { Link } from 'react-router-dom'
import TripModal from "../Manager/tripModal";
import Loading from "../Loading";


class MyTrips extends Component {

    state = {
        tripOnModal: null,
    }

    setModal = (item) => {
        this.setState({tripOnModal : item})
    }

    closeModal = () => {
        this.setState({tripOnModal : null})
    }
    
    render() {
        if(this.props.worker == null) {
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
                                this.props.worker.trips.map(item => {
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
                                this.props.worker.trips.map(item => {
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
                </div>
            )
        }
    }
}

export default MyTrips