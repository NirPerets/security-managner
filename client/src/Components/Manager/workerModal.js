import { Component } from "react";
import Loading from "../Loading";
import SuccessModal from "./successModal";
import ErrorModal from "./errorModal";

class WorkerModal extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        showLoading: false,
        showSuccess: false,
        showError: false,
        worker: null,
        trips: null
    }

    deleteWorker = async () => {
        this.setState({showLoading: true})

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , "x-access-token" : localStorage.getItem('token') },
            body: JSON.stringify({
                id: this.props.worker._id
            })
        }

        fetch(('/user/' + localStorage.getItem('user') + '/deleteWorker'), requestOptions)
        .then(response => {
            if(response.status == '200') this.setState({ showLoading: false, showSuccess: true })
            else this.setState({ showLoading: false, showError: true })
        })
    }

    getTrips = () => {
        this.setState({showLoading: true})
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , "x-access-token" : localStorage.getItem('token') },
            body: JSON.stringify({
                id: this.props.worker._id
            })
        }

        fetch(('/user/' + localStorage.getItem('user') + '/getWorkerTrips'), requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.setState({ 
                showLoading: false, 
                trips: data,
                worker: this.props.worker
            })
        })
    }

    componentDidMount() {
        this.getTrips()
    }

    render() {
        if(this.state.showLoading) {
            return(
                <Loading />
            )
        } else if(this.state.showSuccess) {
            return(
                <SuccessModal closeModal={this.props.closeModal} text="העובד הוסר" />
            )
        } else if(this.state.showError) {
            return(
                <ErrorModal closeModal={this.props.closeModal} text="לא ניתן למחוק עובד שמקושר לטיולים" />
            )
        }

        if(this.state.worker === null || this.state.trips === null) {
            return (<></>)
        } else {
            return(
                <>
                    <div className="modal trip">
                        <button onClick={ this.props.closeModal } className="close-btn">X</button>
                        <div className="modal-heading">{ this.props.worker.fullName }</div>
                        <div className="modal-body">
                            <div className="block">
                                <h1>שם</h1>
                                <p>{ this.props.worker.fullName }</p>
                            </div>
                            <div className="block">
                                <h1>תעודת זהות</h1>
                                <p>{ this.props.worker.id }</p>
                            </div>
                            <div className="block">
                                <h1>סטטוס</h1>
                                <p>{ this.props.worker.status }</p>
                            </div>
                            <div className="block">
                                <h1>כתובת</h1>
                                <p>{ this.props.worker.address }</p>
                            </div>
                            <div className="block">
                                <h1>פלאפון</h1>
                                <p>{ this.props.worker.phone }</p>
                            </div>
                            <div className="block">
                                <h1>תפקיד</h1>
                                <p>{ this.props.job }</p>
                            </div>
                        </div>

                        <table className="modal-table">
                            <thead>
                                <tr>
                                    <th>גוף טיול</th>
                                    <th>תאריך התחלה</th>
                                    <th>תאריך סיום</th>
                                    <th>מיקום</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.trips.map(trip => {
                                        return(
                                            <tr>
                                                <td>{ trip.body }</td>
                                                <td>{ trip.startDate }</td>
                                                <td>{ trip.finishDate }</td>
                                                <td>{ trip.area }</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <button onClick={ this.deleteWorker } className="btn close delete-trip">הסר עובד</button>
                    </div>
                </>
            )
        }
    }
}

export default WorkerModal