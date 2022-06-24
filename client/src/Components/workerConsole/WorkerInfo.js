import { Component } from "react";
import iconCheck from "../../Icons/iconCheck";

class WorkerInfo extends Component {

    state = {
        update: false
    }

    componentDidMount() {
    }

    acceptTrip = async (trip) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                trip: trip._id
            })
        };

        const response = await fetch(('/worker/' + localStorage.getItem('worker') + '/acceptTrip'), requestOptions);
        const data = await response.json();
        this.setState({ update: true })
        window.location.reload(false)
    }

    render() {
        return(
            <div className="worker-right">
                <div className="square worker-info-block">
                    <div className="square-title">
                        <h1>פרטי עובד</h1>
                    </div>

                    <div className="worker-info">
                        <div className="block">
                            <h1>שם העובד</h1>
                            <p>{ this.props.worker.fullName }</p>
                        </div>

                        <div className="block">
                            <h1>תעודת זהות</h1>
                            <p>{ this.props.worker.id }</p>
                        </div>

                        <div className="block">
                            <h1>כתובת</h1>
                            <p>{ this.props.worker.address }</p>
                        </div>

                        <div className="block">
                            <h1>פלאפון</h1>
                            <p>{ this.props.worker.phone }</p>
                        </div>
                    </div>
                </div>

                <div class="square worker-trips">
                    <div className="square-title">
                        <h1>טיולים משוייכים</h1>
                    </div>

                    <div className="miniTable">
                        <table>
                            {
                                this.props.trips.map(trip => {
                                    return(
                                        <tr>
                                            <td><h1>{ trip.body }</h1></td>
                                            <td><p>{ trip.startDate }</p></td>
                                            <td><p>{ trip.area }</p></td>
                                            <td><p>{ trip.contact }</p></td>
                                            <td>
                                                {
                                                    this.props.worker.acceptedTrips.includes(trip._id) ?
                                                    <div class="accept-icon">{iconCheck}</div> :
                                                    <button className="accept-trip" onClick={ () => this.acceptTrip(trip) }>אשר הגעה</button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default WorkerInfo