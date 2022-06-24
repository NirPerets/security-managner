import { Component } from "react"
import InputRow from "../InputRow"
import iconCheck from '../../Icons/iconCheck'
import SuccessModal from "./successModal"
import MapInput from "../mapInput"
import { getLatLng } from 'react-places-autocomplete';

class NewWorker extends Component {

    state = {
        name: '',
        phone: '',
        address: '',
        x: '',
        y: '',
        job: 'guard',
        id: '',
        activeField: "",
        showError: false,
        errors: [],
        finalScreen: false,
        success: false,
    }

    selectJob = (e) => {
        this.setState({ job : e.target.id })
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.id] : e.target.value })
    }
    
    handleMapChange = async address => {
        const latLng = await getLatLng(address[0])
        this.setState({
            address : address[0].formatted_address,
            x: latLng.lat,
            y: latLng.lng,
        })
    }

    validation = () => {
        let errors = []
        if(this.state.name === "") {errors.push('name')}
        if(this.state.phone === "") {errors.push('phone')}
        if(this.state.address === "") {errors.push('address')}
        if(this.state.id === "") {errors.push('id')}
        if(this.state.city === "") {errors.push('city')}

        this.setState({ errors: errors })
    }

    submitForm = async () => {
        await this.validation()

        if(this.state.errors.length > 0) {
            this.setState({ showError: true })
            return 0;
        } 

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , "x-access-token" : localStorage.getItem('token')},
            body: JSON.stringify({
                name: this.state.name,
                phone: this.state.phone,
                address: this.state.address,
                id: this.state.id,
                job: this.state.job,
                x: this.state.x,
                y: this.state.y,
            })
        };

        fetch(('/user/' + localStorage.getItem('user') + '/newWorker'), requestOptions)
        .then(response => {
            console.log(response)
            if(response.status == '200') this.setState({ finalScreen: true })
        })

        /*
        if(this.state.job === 'guard') {
            fetch('/workers/guard/', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.isSaved) { this.setState({ finalScreen: true })}
            }) 
        } else {
            fetch('/workers/medic/', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.isSaved) { this.setState({ finalScreen: true })}
            })
        }*/
    }

    render() {

        if(!this.state.finalScreen) {
            return(
                <>
                    <div className="modal">
                        <button onClick={ this.props.closeModal } className="close-btn">X</button>
                        <div className="modal-heading">הוספת עובד חדש</div>
                        <form onSubmit={e => e.preventDefault()}>
                            <div className="inputs">
                                <InputRow handleInputChange={ this.handleInputChange } isError={this.state.errors.includes('name') ? true : false} label="שם העובד" id="name" />
                                <InputRow handleInputChange={ this.handleInputChange } isError={this.state.errors.includes('phone') ? true : false} label="פלאפון" id="phone" />
                                <InputRow handleInputChange={ this.handleInputChange } isError={this.state.errors.includes('id') ? true : false} label="ת.ז" id="id" />
                                <MapInput handleMapChange={ this.handleMapChange } label="כתובת" id="address" isError={this.state.errors.includes('address') ? true : false}/>
                                <div className="job-select">
                                    <button id="guard" onClick={ this.selectJob } className={"select-button " + (this.state.job === "guard" ? 'active' : '')}>מאבטח</button>
                                    <button id="medic" onClick={ this.selectJob } className={"select-button " + (this.state.job === "medic" ? 'active' : '')}>חובש</button>
                                </div>
                                <button id="double" onClick={ this.selectJob } className={"select-button full " + (this.state.job === "double" ? 'active' : '')}>מאבטח וחובש</button>
                            </div>
    
                            <div className={"error-container " + (this.state.showError ? 'show' : '')}>
                                <p>
                                    שגיאה - פרטים חסרים מסומנים <span>באדום</span>
                                </p>
                            </div>
    
                            <button className="btn full" onClick={this.submitForm} type="submit">הוסף עובד</button>
                        </form>
                    </div>
                </>
            )
        } else {
            return(
                <>
                    <SuccessModal closeModal={this.props.closeModal} text="הוספת העובד הושלמה בהצלחה" />
                </>
            )
        }
    }
}

export default NewWorker