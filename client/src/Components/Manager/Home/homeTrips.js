const { Component } = require("react");

class HomeTrips extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <>
                <div className="square homeTrips">
                    <div className="square-title" style={{ marginBottom: 0}}>
                        <h1>{ this.props.title }</h1>
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
            </>
        )
    }
}

export default HomeTrips