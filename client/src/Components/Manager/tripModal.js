import { Component } from "react";
import Loading from "../Loading";
import SuccessModal from "./successModal";
import InputRow from "../InputRow";
import MapInput from "../mapInput";
import iconPlus from '../../Icons/iconPlus'
import iconCheck from "../../Icons/iconCheck";
import iconX from "../../Icons/iconX";

class TripModal extends Component {

    constructor(props) {
        super(props)
    }
    
    state = {
        /* ================== TRIPS PROPS ======================== */
        class: this.props.trip.class,
        city: this.props.trip.city,
        startDate: this.props.trip.startDate,
        finishDate: this.props.trip.finishDate,
        hour: this.props.trip.hour,
        address: this.props.trip.address,
        contact: this.props.trip.contact,
        email: this.props.trip.email,
        sleep: this.props.trip.sleep,
        x: this.props.trip.x,
        y: this.props.trip.y,
        /* ================== TRIPS PROPS ======================== */
        availableWorkers: [],
        showLoading: false,
        showSuccess: false,
        showEdit: false,
        showWorkersModal: false,
        guards: [],
        medics: [],
        newGuards: this.props.trip.guards,
        newMedics: this.props.trip.medics,
        newWorkers: [],
        workersToDelete: [],
    }

    deleteTrip = async () => {
        this.setState({showLoading: true})
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , "x-access-token" : localStorage.getItem('token') },
            body: JSON.stringify({
                id: this.props.trip._id
            })
        }

        fetch(('/user/' + localStorage.getItem('user') + '/deleteTrip'), requestOptions)
        .then(response => {
            if(response.status == '200') this.setState({ showLoading: false, showSuccess: true })
        })
    }

    getTripWorkers = () => {
        this.setState({showLoading: true})
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , "x-access-token" : localStorage.getItem('token') },
            body: JSON.stringify({
                id: this.props.trip._id
            })
        }

        fetch(('/user/' + localStorage.getItem('user') + '/getTripWorkers'), requestOptions)
        .then(response => response.json())
        .then(data => {
            this.setState({ 
                showLoading: false, 
                guards: data.guards,
                medics: data.medics,
            })
        })
    }

    compareDateRange = (startDate, finishDate) => {
        const startDateObj = new Date(startDate)
        const endDateObj = new Date(finishDate)
        const startDateToCheck = new Date(this.state.startDate)
        const finishDateToCheck = new Date(this.state.finishDate)

        if(startDateToCheck >= startDateObj && startDateToCheck <= endDateObj || finishDateToCheck >= startDateObj && finishDateToCheck <= endDateObj) return true
        else return false
    }

    getAvailableWorkers = async () => {
        let tempAvailableWorkers = []

        await fetch(('/user/' + localStorage.getItem('user') + '/getWorkersTrips'))
        .then(response => response.json())
        .then(data => {
            tempAvailableWorkers = data

            tempAvailableWorkers.forEach(worker => {
                if(worker.free) tempAvailableWorkers = tempAvailableWorkers.filter(workerToFilter => workerToFilter !== worker)
                worker.trips.forEach((trip) => {
                    if(this.compareDateRange(trip.startDate, trip.finishDate)) {
                        tempAvailableWorkers = tempAvailableWorkers.filter(workerToFilter => workerToFilter !== worker)
                    } 
                })
            });
        })

        this.setState({ availableWorkers : tempAvailableWorkers })
    }

    editTrip = () => {
        this.setState({ showEdit : true })
    }

    addWorkers = async () => {
        let tempNewGuards = this.state.newGuards
        let tempNewMedics = this.state.newMedics

        await this.state.newWorkers.forEach(worker => {
            if(worker.job == 'guard') tempNewGuards.push(worker)
            else tempNewMedics.push(worker)
        })

        this.setState({
            newGuards: tempNewGuards,
            newMedics: tempNewMedics,
            showWorkersModal: false
        })
    }

    removeWorker = (worker) => {
        if(this.state.workersToDelete.includes(worker)) this.setState({ workersToDelete : this.state.workersToDelete.filter(arrWorker => arrWorker._id != worker._id )}) 
        else this.setState({ workersToDelete : [...this.state.workersToDelete, worker]})
    }

    openWorkersModal = async () => {
        this.setState({ showLoading: true })
        await this.getAvailableWorkers()
        this.setState({ showLoading: false, showWorkersModal: true })
    }

    closeWorkersModal = () => {
        this.setState({ showWorkersModal : false })
    }

    newWorkerHandle = (worker) => {
        let tempArr = this.state.newWorkers
        if(!this.state.newWorkers.includes(worker)) {
            tempArr.push(worker)
        } else {
            const i = tempArr.indexOf(worker)
            tempArr.splice(i, 1)
        }
        this.setState({ newWorkers: tempArr })
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }

    updateTrip = async () => {
        this.setState({showLoading: true})
        let guards = this.state.newGuards
        let medics = this.state.newMedics

        await this.state.workersToDelete.forEach(worker => {
            if(worker.job == 'guard') {
                guards = guards.filter((guard,index) => guard != worker._id)
            } else {
                medics = medics.filter((medic,index) => medic != worker._id)
            }
        })

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , "x-access-token" : localStorage.getItem('token') },
            body: JSON.stringify({
                class: this.state.class,
                city: this.state.city,
                startDate: this.state.startDate,
                finishDate: this.state.finishDate,
                hour: this.state.hour,
                address: this.state.address,
                contact: this.state.contact,
                email: this.state.email,
                sleep: this.state.sleep,
                guards: guards,
                medics: medics,
                newWorkers: this.state.newWorkers,
                workersToDelete: this.state.workersToDelete
            })
        }

        fetch(('/user/' + localStorage.getItem('user') + '/' + this.props.trip._id), requestOptions)
        .then(response => response.json())
        .then(data => {
            this.setState({ 
                showLoading: false,
                showEdit: false,
                class: data.class,
                city: data.city,
                startDate: data.startDate,
                finishDate: data.finishDate,
                hour: data.hour,
                address: data.address,
                contact: data.contact,
                email: data.email,
                sleep: data.sleep,
                guards: guards,
                medics: medics,
                newWorkers: [],
                workersToDelete: []
            })
        })
    }

    componentDidMount() {
        this.getTripWorkers()
    }

    render() {
        if(this.state.showLoading) {
            return(<Loading />)
        } else if(this.state.showSuccess) {
            return(<SuccessModal closeModal={ this.props.closeModal} text="הטיול הוסר" />)
        }

        if(this.props.trip === null) {
            return (<></>)
        } else if (!this.state.showEdit) {
            return(
                <>
                    <div className="modal trip">
                        <div className="modal-heading">
                            <button onClick={ this.editTrip } className="edit-trip">ערוך</button>
                            <h1>{ this.props.trip.body }</h1>
                            <button onClick={ this.props.closeModal } className="close-btn">X</button>
                        </div>
                        <div className="modal-body">
                            <div className="block">
                                <h1>כיתה</h1>
                                <p>{ this.state.class }</p>
                            </div>
                            <div className="block">
                                <h1>עיר</h1>
                                <p>{ this.state.city }</p>
                            </div>
                            <div className="block">
                                <h1>תאריך התחלה</h1>
                                <p>{ this.state.startDate }</p>
                            </div>
                            <div className="block">
                                <h1>תאריך סיום</h1>
                                <p>{ this.state.finishDate }</p>
                            </div>
                            <div className="block">
                                <h1>שעת התייצבות</h1>
                                <p>{ this.state.hour }</p>
                            </div>
                            <div className="block">
                                <h1>כתובת התייצבות</h1>
                                <p>{ this.state.address }</p>
                            </div>
                            <div className="block">
                                <h1>איש קשר</h1>
                                <p>{ this.state.contact }</p>
                            </div>
                            <div className="block">
                                <h1>מייל לקוח</h1>
                                <p>{ this.state.email }</p>
                            </div>
                            <div className="block">
                                <h1>סוג שינה</h1>
                                <p>{ this.state.sleep }</p>
                            </div>
                        </div>

                        <table className="modal-table">
                            <thead>
                                <tr>
                                    <th>שם</th>
                                    <th>תפקיד</th>
                                    <th>פלאפון</th>
                                    <th>מצב</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.guards.map(guard => {
                                        return(
                                            <tr>
                                                <td>{ guard.fullName }</td>
                                                <td>מאבטח</td>
                                                <td>{ guard.phone }</td>
                                                <td>
                                                    {
                                                        guard.acceptedTrips.includes(this.props.trip._id) ?
                                                        <div class="accept-icon">{ iconCheck }</div> : <div class="unaccept-icon">{ iconX }</div>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                {
                                    this.state.medics.map(medic => {
                                        return(
                                            <tr>
                                                <td>{ medic.fullName }</td>
                                                <td>חובש</td>
                                                <td>{ medic.phone }</td>
                                                <td>
                                                    {
                                                        medic.acceptedTrips.includes(this.props.trip._id) ?
                                                        <div class="accept-icon">{ iconCheck }</div> : <div class="unaccept-icon">{ iconX }</div>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <button onClick={ this.deleteTrip } className="btn close delete-trip">הסר טיול</button>
                    </div>
                </>
            )
        } else if (this.state.showEdit) {
            return(
                <>
                <div className="modal trip">
                    <div className="modal-heading">
                        <button onClick={ this.updateTrip } className="edit-trip">שמור</button>
                        <h1>{ this.props.trip.body }</h1>
                        <button onClick={ this.props.closeModal } className="close-btn">X</button>
                    </div>
                    <div className="modal-body">
                        <div className="block">
                            <InputRow handleInputChange={ this.handleInputChange } label="כיתה" id="class" value={this.state.class} />
                        </div>
                        <div className="block">
                            <InputRow handleInputChange={ this.handleInputChange } label="עיר" id="city" value={this.state.city} />
                        </div>
                        <div className="block">
                            <InputRow handleInputChange={ this.handleInputChange } label="תאריך התחלה" id="startDate" value={this.state.startDate} />
                        </div>
                        <div className="block">
                            <InputRow handleInputChange={ this.handleInputChange } label="תאריך סיום" id="finishDate" value={this.state.finishDate} />
                        </div>
                        <div className="block">
                            <InputRow handleInputChange={ this.handleInputChange } label="שעת התייצבות" id="hour" value={this.state.hour} />
                        </div>
                        <div className="block">
                            <MapInput handleInputChange={ this.handleInputChange } label="כתובת התייצבות" id="address" value={this.state.address} />
                        </div>
                        <div className="block">
                            <InputRow handleInputChange={ this.handleInputChange } label="איש קשר" id="contact" value={this.state.contact} />
                        </div>
                        <div className="block">
                            <InputRow handleInputChange={ this.handleInputChange } label="מייל לקוח" id="email" value={this.state.email} />
                        </div>
                        <div className="block">
                            <InputRow handleInputChange={ this.handleInputChange } label="סוג שינה" id="sleep" value={this.state.sleep} />
                        </div>
                    </div>

                    <table className={ "modal-table" + (this.state.showEdit ? ' edit' : '')}>
                        <thead>
                            <tr>
                                <th>שם</th>
                                <th>תפקיד</th>
                                <th>פלאפון</th>
                                <th>מצב</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.guards.map(guard => {
                                    return(
                                        <tr onClick={ () => this.removeWorker(guard) } className={ this.state.workersToDelete.includes(guard) ? 'red' : '' }>
                                            <td>{ guard.fullName }</td>
                                            <td>מאבטח</td>
                                            <td>{ guard.phone }</td>
                                            <td>
                                                {
                                                    guard.acceptedTrips.includes(this.props.trip._id) ?
                                                    <div class="accept-icon">{ iconCheck }</div> : <div class="unaccept-icon">{ iconX }</div>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {
                                this.state.medics.map(medic => {
                                    return(
                                        <tr onClick={ () => this.removeWorker(medic) } className={ this.state.workersToDelete.includes(medic) ? 'red' : '' }>
                                            <td>{ medic.fullName }</td>
                                            <td>חובש</td>
                                            <td>{ medic.phone }</td>
                                            <td>
                                                {
                                                    medic.acceptedTrips.includes(this.props.trip._id) ?
                                                    <div class="accept-icon">{ iconCheck }</div> : <div class="unaccept-icon">{ iconX }</div>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <button onClick={ this.openWorkersModal } className="add-workers">הוסף עובדים { iconPlus }</button>

                    <div className={"modal-container" + (this.state.showWorkersModal ? ' show' : '')}>
                        <div className="modal">
                            <button onClick={ this.closeWorkersModal } className="close-btn">X</button>
                            <div className="modal-heading">הוספת עובדים</div>

                            <div className="modal-body">
                                <table className={ "modal-table" + (this.state.showEdit ? ' edit' : '')}>
                                    <thead>
                                        <tr>
                                            <th>שם</th>
                                            <th>תפקיד</th>
                                            <th>פלאפון</th>
                                            <th>כתובת</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.availableWorkers.map(worker => {
                                                return(
                                                    <tr onClick={ () => this.newWorkerHandle(worker) } className={ this.state.newWorkers.some(loopWorker => loopWorker === worker) ? 'green' : 'black' }>
                                                        <td>{ worker.fullName }</td>
                                                        <td>{ worker.job == 'guard' ? 'מאבטח' : 'חובש' }</td>
                                                        <td>{ worker.phone }</td>
                                                        <td>{ worker.address }</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <button onClick={ this.addWorkers } className="add-workers">סיים { iconPlus }</button>
                            </div>
                        </div>
                    </div>

                    <button onClick={ this.deleteTrip } className="btn close delete-trip">הסר טיול</button>
                </div>
            </>
            )
        }
    }
}

export default TripModal