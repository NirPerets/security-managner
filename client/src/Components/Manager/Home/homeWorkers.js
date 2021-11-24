import iconGuard from "../../../Icons/iconGuard";
import iconMedic from "../../../Icons/iconMedic";
const { Component } = require("react");

class HomeWorkers extends Component {
    constructor() {
        super()
    }

    render() {
        return(
            <>
                <div className="square workersBlock">
                    <div className="square-title" style={{ marginBottom: 0}}>
                        <h1>{ this.props.title }</h1>
                    </div>

                    <div className="miniTable">
                        {
                            this.props.guards.map(item => {
                                return(
                                    <div className="block guard">
                                        { iconGuard }
                                        <h1>{ item.fullName }</h1>
                                        <p>{ item.phone }</p>
                                    </div>
                                )
                            })
                        }

                        {
                            this.props.medics.map(item => {
                                return(
                                    <div className="block medic">
                                        { iconMedic }
                                        <h1>{ item.fullName }</h1>
                                        <p>{ item.phone }</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default HomeWorkers