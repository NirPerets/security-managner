import { Component } from "react";

class WorkerTableModal extends Component {
    render() {
        return(
        <table className="list-table">
            <thead>
                <tr>
                    <th>שם העובד</th>
                    <th>סטטוס</th>
                    <th>מספר שעות</th>
                    <th>כתובת</th>
                    <th>פלאפון</th>
                </tr>
            </thead>
            <tbody className={"workers " + (this.state.showGuards ? 'show' : '')}>
                {
                    this.state.guards.map(item => {
                        return(
                            <tr onClick={ () => this.openWorkerModal(item,"מאבטח") }>
                                <td>{ item.fullName }</td>
                                <td>{ item.status ? 'בעבודה' : 'פנוי' }</td>
                                <td>{ 100 }</td>
                                <td>{ item.address }</td>
                                <td>{ item.phone }</td>
                            </tr>
                        )
                    })
                }
            </tbody>
            <tbody className={"workers "  + (this.state.showGuards ? '' : 'show')}>
                {
                    this.state.medics.map(item => {
                        return(
                            <tr onClick={ () => this.openWorkerModal(item,"חובש") }>
                                <td>{ item.fullName }</td>
                                <td>{ item.status ? 'בעבודה' : 'פנוי' }</td>
                                <td>{ 100 }</td>
                                <td>{ item.address }</td>
                                <td>{ item.phone }</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        )
    }
}

export default WorkerTableModal