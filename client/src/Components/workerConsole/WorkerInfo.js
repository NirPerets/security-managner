import { Component } from "react";

class WorkerInfo extends Component {
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