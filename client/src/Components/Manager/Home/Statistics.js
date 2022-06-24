import { Component } from "react";
import iconGuard from "../../../Icons/iconGuard";
import iconMedic from "../../../Icons/iconMedic";
import iconTravel from "../../../Icons/iconTravel";
import iconCheck from "../../../Icons/iconCheck";

class Statistics extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <>
                <div className="statistics">
                    <div className="block blue">
                        <div className="left">
                            <div className="icon">{ iconTravel }</div>
                        </div>

                        <div className="right">
                            <h1>{ this.props.tripCount }</h1>
                            <p>מספר טיולים</p>
                        </div>
                    </div>

                    <div className="block orange">
                        <div className="left">
                            <div className="icon">{ iconCheck }</div>
                        </div>

                        <div className="right">
                            <h1>{ this.props.activeTrips }</h1>
                            <p>טיולים פעילים</p>
                        </div>
                    </div>
                    
                    <div className="block purple">
                        <div className="left">
                            <div className="icon">{ iconGuard }</div>
                        </div>

                        <div className="right">
                            <h1>{ this.props.guardCount }</h1>
                            <p>מספר מאבטחים</p>
                        </div>
                    </div>

                    <div className="block red">
                        <div className="left">
                            <div className="icon">{ iconMedic }</div>
                        </div>

                        <div className="right">
                            <h1>{ this.props.medicCount }</h1>
                            <p>מספר חובשים</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Statistics