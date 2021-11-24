import { Component } from "react";
import iconGuard from '../../../Icons/iconGuard'
import iconMedic from '../../../Icons/iconMedic'
import iconTravel from "../../../Icons/iconTravel";

class NextTrip extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log(this.props.trip)
    }

    render() {

        if(this.props.trip == null) {
            return (
            <div className="square nextTrip">
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
            )
        } else {
            return (
                <>
                    <div className="square nextTrip">
                        <div className="square-title">
                            <h1>הטיול הקרוב</h1>
                        </div>
    
                        <div className="next-trip">
                            <h1>{ this.props.trip.startDate } - { this.props.trip.finishDate }</h1>
                            <h2>{ this.props.trip.body }</h2>
                            <h3>{ this.props.trip.contact }</h3>
    
                            <div className="block">
                                { iconGuard }
                                <h1>{ this.props.trip.guards.length } מאבטחים</h1>
                            </div>

                            <div className="block">
                                { iconMedic }
                                <h1>{ this.props.trip.medics.length } חובשים</h1>
                            </div>
                        </div>
                    </div>
                </>
            )
        }   
    }
}

export default NextTrip;