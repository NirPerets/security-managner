import { Component } from "react";
import NewWorker from "./newWorker";
import WorkerModal from "./workerModal";
import Loading from "../Loading";
import checkLoginStatus from "../Functions/checkLoginStatus";

class WorkerList extends Component {

    state = {
        showModal: false,
        showGuards: true, // true - show guards, false - show medics 
        guards: null,
        medics: null,
        workerOnModal: null,
        modalJob: '',
    }

    handleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }))
    }

    showMedics = () => {
        this.setState({showGuards : false})
    }

    showGuards = () => {
        this.setState({showGuards : true})
    }

    closeWorkerModal = () => {
        this.setState({workerOnModal : null})
    }

    openWorkerModal = (worker, job) => {
        this.setState({ 
            modalJob: job,
            workerOnModal: worker
         })
    }

    getWorkers = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "x-access-token" : localStorage.getItem('token')}
        }

        const response = await fetch(('/user/' + localStorage.getItem('user')) + '/getWorkers', requestOptions);
        const data = await response.json()

        let tempGuards = []
        let tempMedics = []

        data.forEach(worker => {
            if (worker.job == 'guard') tempGuards.push(worker)
            else if (worker.job == 'medic') tempMedics.push(worker)
            else if (worker.job == 'double') {
                tempMedics.push(worker)
                tempGuards.push(worker)
            }
        })

        this.setState({
            guards: tempGuards,
            medics: tempMedics
        })
    }

    componentDidMount() {
        checkLoginStatus()
        this.getWorkers()
    }

    render() {

        if(this.state.guards == null || this.state.medics == null) {
            return (
                <div className="loading-container">
                    <Loading />
                </div>
            )
        }

        if(this.state.workerOnModal != null) {
            return(
                <div className="fade">
                    <div className="page-heading" style={{marginBottom: '30px'}}>
                        <h1>רשימת עובדים</h1>
                        <div className="job-pick">
                            <button onClick={this.showGuards} className={(this.state.showGuards ? 'active' : '')}>מאבטחים</button>
                            <button onClick={this.showMedics} className={(this.state.showGuards ? '' : 'active')}>חובשים</button>
                        </div>
                        <button onClick={ this.handleModal }>הוספת עובד חדש</button>
                    </div>
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
                                        <tr className={ this.item.status ? 'active' : ''} onClick={ () => this.openWorkerModal(item,"מאבטח") }>
                                            <td>{ item.fullName }</td>
                                            <td>{ item.status ? 'בעבודה' : 'פנוי' }</td>
                                            <td>{ item.trips.length  }</td>
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
                                        <tr className={ this.item.status ? 'active' : ''} onClick={ () => this.openWorkerModal(item,"חובש") }>
                                            <td>{ item.fullName }</td>
                                            <td>{ item.status ? 'בעבודה' : 'פנוי' }</td>
                                            <td>{ item.trips.length }</td>
                                            <td>{ item.address }</td>
                                            <td>{ item.phone }</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <div className={"modal-container " + (this.state.showModal ? 'show': '')}>
                        <NewWorker closeModal={ this.handleModal } />
                    </div>
                    <div className={"modal-container " + (this.state.workerOnModal != null ? 'show' : '')}>
                        <WorkerModal job={ this.state.modalJob } closeModal={ this.closeWorkerModal } worker={ this.state.workerOnModal } />
                    </div>
                </div>   
            )
        } 
        else {
            return(
                <div className="fade">
                    <div className="page-heading" style={{marginBottom: '30px'}}>
                        <h1>רשימת עובדים</h1>
                        <div className="job-pick">
                            <button onClick={this.showGuards} className={(this.state.showGuards ? 'active' : '')}>מאבטחים</button>
                            <button onClick={this.showMedics} className={(this.state.showGuards ? '' : 'active')}>חובשים</button>
                        </div>
                        <button onClick={ this.handleModal }>הוספת עובד חדש</button>
                    </div>
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>שם העובד</th>
                                <th>סטטוס</th>
                                <th>כתובת</th>
                                <th>מספר טיולים</th>
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
                                            <td>{ item.address }</td>
                                            <td>{ item.trips.length }</td>
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
                                            <td>{ item.address }</td>
                                            <td>{ item.trips.length }</td>
                                            <td>{ item.phone }</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <div className={"modal-container " + (this.state.showModal ? 'show': '')}>
                        <NewWorker closeModal={ this.handleModal } />
                    </div>
                </div>
            )
        }
    }
}

export default WorkerList