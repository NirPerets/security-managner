import { Component } from "react";
import iconTravel from "../../Icons/iconTravel";
import iconMedic from "../../Icons/iconMedic";
import iconGuard from "../../Icons/iconGuard";

class NextTrip extends Component {
    render() {
        if(this.props.trips.length === 0) {
            return(
                <>
                    <div className="square mini">
                        <div className="square-title">
                            <h1>הטיול הקרוב</h1>
                        </div>

                        <div className="no-trip">
                            <div>
                                { iconTravel }
                                <h1>אין טיולים קרובים</h1>
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return(
                <>
                    <div className="square mini">
                        <div className="square-title">
                            <h1>הטיול הקרוב</h1>
                        </div>
    
                        <div className="next-trip">
                            <h1>{ this.props.trips[0].startDate } - { this.props.trip.finishDate }</h1>
                            <h2>{ this.props.trips[0].body }</h2>
                            <h3>{ this.props.trips[0].contact }</h3>
    
                            <div className="block">
                                { iconGuard }
                                <h1>{ this.props.trips[0].guards.length } מאבטחים</h1>
                            </div>
    
                            <div className="block">
                                { iconMedic }
                                <h1>{ this.props.trips[0].medics.length } חובשים</h1>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default NextTrip