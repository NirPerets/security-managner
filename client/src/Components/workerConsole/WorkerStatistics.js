import { Component } from "react";
import iconTravel from "../../Icons/iconTravel";
import iconCheck from "../../Icons/iconCheck";
import iconClock from "../../Icons/iconClock";
import iconX from "../../Icons/iconX";
import iconMedic from "../../Icons/iconMedic";
import iconGuard from "../../Icons/iconGuard";

class WorkerStatistics extends Component {
    render() {
        return(
            <>
                <div className="statistics">
                    <div className="block blue">
                        <div className="left">
                            <div className="icon">{ iconTravel }</div>
                        </div>

                        <div className="right">
                            <h1>{ this.props.worker.trips.length }</h1>
                            <p>מספר טיולים</p>
                        </div>
                    </div>
                    
                    <div className="block purple">
                        <div className="left">
                            <div className="icon">{ this.props.worker.status ? iconX : iconCheck }</div>
                        </div>

                        <div className="right">
                            <h1>{ this.props.worker.status ? 'בעבודה' : 'פנוי' }</h1>
                            <p>סטטוס</p>
                        </div>
                    </div>

                    <div className="block red">
                        <div className="left">
                            <div className="icon">{ this.props.worker.job == 'guard' ? iconGuard : iconMedic }</div>
                        </div>

                        <div className="right">
                            <h1>{ this.props.worker.job == 'guard' ? 'מאבטח' : 'חובש' }</h1>
                            <p>תפקיד</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default WorkerStatistics