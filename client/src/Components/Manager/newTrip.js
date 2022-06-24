import { Component } from "react"
import { Link } from 'react-router-dom'
import iconPlus from '../../Icons/iconPlus'
import iconMinus from "../../Icons/iconMinus"
import InputRow from "../InputRow"
import Loading from "../Loading"
import SuccessModal from "./successModal"
import MapInput from "../mapInput"
import { getLatLng } from 'react-places-autocomplete';
import getDistance from 'geolib/es/getDistance';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import jsPDF from 'jspdf'

class newTrip extends Component {

    state = {
        /* === Form Properties === */
        tripSender: "",
        school: "",
        class: "",
        city: "",
        address: "",
        area: "",
        startDate: "",
        finishDate: "",
        meetAddress: "",
        hour: "",
        contact: "",
        x: "",
        y: "",
        guardCount: 0,
        medicCount: 0,
        guards: [],
        medics: [],
        email: '',
        sleep: '',
        /* === END Form Properties === */
        freeGuards: [],
        freeMedics: [],
        activeField: "",
        stage: "1",
        errors: [],
        showError: false,
        showLoading: false,
        showSuccess: false,
    }

    validation = () => {
        let errors = []
        if(this.state.stage === "1") {
            /*if(this.state.tripSender === "") {errors.push('tripSender')}
            if(this.state.school === "") {errors.push('school')}
            if(this.state.class === "") {errors.push('class')}
            if(this.state.city === "") { errors.push('city') }
            if(this.state.address === "") {errors.push('address')}
            if(this.state.area === "") {errors.push('area')}*/
            if(this.state.startDate === "") {errors.push('startDate')}
            if(this.state.finishDate === "") {errors.push('finishDate')}
            /*if(this.state.hour === "") {errors.push('hour')}
            if(this.state.meetAddress === "") {errors.push('meetAddress')}
            if(this.state.meetAddress === "") {errors.push('contact')}
            if(this.state.sleep === "") {errors.push('sleep')}
            if(this.state.email === "") {errors.push('email')}*/
        } else if (this.state.stage === "2") {
            if(this.state.guards.length !== this.state.guardCount ) {errors.push('guards')}
        } else if (this.state.stage === "3") {
            if(this.state.medics.length !== this.state.medicCount ) {errors.push('medics')}
        }

        this.setState({errors: errors})
    }

    getDistances = async () => {
        let tempGuards = this.state.freeGuards
        let tempMedics = this.state.freeMedics

        await tempGuards.forEach(item => {
            item.distance = Math.floor((getDistance(
                {latitude: item.x, longitude: item.y},
                {latitude: this.state.x, longitude: this.state.y}
            ) / 1000), 1)
        })

        await tempMedics.forEach(item => {
            item.distance = Math.floor((getDistance(
                {latitude: item.x, longitude: item.y},
                {latitude: this.state.x, longitude: this.state.y}
            ) / 1000), 1)
        })

        this.setState({
            freeGuards: tempGuards,
            freeMedics: tempMedics
        })
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

    activeField = (e) => {
        this.setState({ activeField : e.target.id })
    }

    deactiveField = () => {
        this.setState({ activeField : '' })
    }

    nextStage = async () => {
       await this.validation()

        if(this.state.errors.length === 0) {
            await this.setState({ 
                stage: String(Number(this.state.stage) + 1),
                errors: [],
                showError: false,
            })
        } else {
            this.setState({showError: true})
        }

        if(this.state.stage == "2") {
            await this.getWorkers()
            await this.getDistances();
        }
    }

    prevStage = () => {
        this.setState({ stage: String(Number(this.state.stage) - 1)})
    }

    increase = (e) => {
        const id = e.currentTarget.id
        this.setState(prevState => ({
            [id] : prevState[id] + 1
        }))
    }

    decrease = (e) => {
        const id = e.currentTarget.id
        if(this.state[id] > 0) {
            this.setState(prevState => ({
                [id] : prevState[id] - 1
            }))  
        }
    }

    selectGuards = (worker) => {
        let tempArr = this.state.guards
        if(!this.state.guards.includes(worker)) {
            tempArr.push(worker)
        } else {
            const i = tempArr.indexOf(worker)
            tempArr.splice(i, 1)
        }
        this.setState({ guards: tempArr })
    }
    
    selectMedics = (worker) => {
        let tempArr = this.state.medics
        if(!this.state.medics.includes(worker)) {
            tempArr.push(worker)
        } else {
            const i = tempArr.indexOf(worker)
            tempArr.splice(i, 1)
        }
        this.setState({ medics: tempArr })
    }

    postForm = () => {
        this.setState({showLoading: true})

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , "x-access-token" : localStorage.getItem('token') },
            body: JSON.stringify({
                body: this.state.tripSender,
                school: this.state.school,
                class: this.state.class,
                city: this.state.city,
                address: this.state.address,
                area: this.state.area,
                startDate: this.state.startDate,
                finishDate: this.state.finishDate,
                hour: this.state.hour,
                contact: this.state.contact,
                meetAddress: this.state.meetAddress,
                guards: this.state.guards,
                medics: this.state.medics,
                x: this.state.x,
                y: this.state.y,
                email: this.state.email,
                sleep: this.state.sleep
            })
        }

        fetch(('/user/' + localStorage.getItem('user') + '/addTrip'), requestOptions)
        .then(response => {
            if(response.status == '200') this.setState({ showLoading: false, showSuccess: true })
        })
    }

    closeModal = () => {
        this.setState({ showSuccess: false })
    }

    getWorkers = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "x-access-token" : localStorage.getItem('token')}
        }

        const response = await fetch(('/user/' + localStorage.getItem('user')) + '/getWorkersTrips', requestOptions);
        const data = await response.json()
        let tempFreeWorkers = data

        let tempGuards = []
        let tempMedics = []


        await tempFreeWorkers.forEach(worker => {
            if(worker.free) tempFreeWorkers = tempFreeWorkers.filter(workerToFilter => workerToFilter !== worker)
            worker.trips.forEach(trip => {
                if(this.compareDateRange(trip.startDate, trip.finishDate)) {
                    tempFreeWorkers = tempFreeWorkers.filter(workerToFilter => workerToFilter !== worker)
                }
            })
        })

        await tempFreeWorkers.map(worker => {
            if (worker.job == 'guard') tempGuards.push(worker)
            else if (worker.job == 'medic') tempMedics.push(worker)
            else if (worker.job == 'double') {
                tempMedics.push(worker)
                tempGuards.push(worker)
            }
        })

        this.setState({
            freeGuards: tempGuards,
            freeMedics: tempMedics
        })
    }

    compareDateRange = (startDate, finishDate) => {
        const startDateObj = new Date(startDate)
        const endDateObj = new Date(finishDate)
        const startDateToCheck = new Date(this.state.startDate)
        const endDateToCheck = new Date(this.state.finishDate)

        if(startDateToCheck >= startDateObj && startDateToCheck <= endDateObj || endDateToCheck >= startDateObj && endDateToCheck <= endDateObj) return true
        else return false
    }

    componentDidMount() {
    }

    render() {

        if(this.state.showLoading) {
            return(<div className="loading-container"><Loading /></div>)
        } else if(this.state.showSuccess) {
            return(
                <div className="modal-container show">
                    <SuccessModal closeModal={ this.closeModal} text="הטיול נוסף בהצלחה" />
                </div>
            )
        }

        return(
            <>
                <div className="page-heading">
                    <h1>הוספת טיול חדש</h1>
                    <Link to="/manager/trips">לרשימת הטיולים</Link>
                </div>
                <div className="form-container">
                    <div className={"progress currentStage" + this.state.stage}>
                        <div className="stage">פרטי הטיול</div>
                        <div className="deltoid"></div>
                        <div className="stage">בחירת מאבטחים</div>
                        <div className="deltoid"></div>
                        <div className="stage">בחירת חובשים</div>
                        <div className="deltoid"></div>
                        <div className="stage">אישור טיול</div>
                    </div>

                    <form onSubmit={e => e.preventDefault()}>
                        <div className={"stage-1 " + (this.state.stage === "1" ? 'show' : '')}>
                            <div className="inputs">
                                <div className="right">
                                    <InputRow handleInputChange={ this.handleInputChange } label="גוף מוציא טיול" id="tripSender" isError={this.state.errors.includes('tripSender') ? true : false} />
                                    <InputRow handleInputChange={ this.handleInputChange } label="שם מוסד" id="school" isError={this.state.errors.includes('school') ? true : false} />
                                    <InputRow handleInputChange={ this.handleInputChange } label="כיתה" id="class" isError={this.state.errors.includes('class') ? true : false} />
                                    <InputRow handleInputChange={ this.handleInputChange } label="עיר" id="city" isError={this.state.errors.includes('city') ? true : false} />
                                    <InputRow handleInputChange={ this.handleInputChange } label="אימייל לקוח" id="email" isError={this.state.errors.includes('email') ? true : false} />
                                    <InputRow handleInputChange={ this.handleInputChange } label="סוג לינה" id="sleep" isError={this.state.errors.includes('sleep') ? true : false} />
                                    <MapInput handleMapChange={ this.handleMapChange } label="כתובת התייצבות" id="address" isError={this.state.errors.includes('address') ? true : false}/>
                                </div>
                                <div className="seperator"></div>
                                <div className="left">
                                    <InputRow handleInputChange={ this.handleInputChange } label="איזור הטיול" id="area" isError={this.state.errors.includes('area') ? true : false} />
                                    <InputRow handleInputChange={ this.handleInputChange } label="תאריך התחלה" id="startDate" isError={this.state.errors.includes('startDate') ? true : false} />
                                    <InputRow handleInputChange={ this.handleInputChange } label="תאריך סיום" id="finishDate" isError={this.state.errors.includes('finishDate') ? true : false} />
                                    <InputRow handleInputChange={ this.handleInputChange } label="שעת התייצבות" id="hour" isError={this.state.errors.includes('hour') ? true : false} />
                                    <InputRow handleInputChange={ this.handleInputChange } label="איש קשר" id="contact" isError={this.state.errors.includes('contact') ? true : false} />
                                    <div className="input-row double">
                                        <div>
                                            <label>מאבטחים</label>
                                            <div className="quantity">
                                                <input onChange={this.handleInputChange} id="guardCount" value={ this.state.guardCount } className="small" type="text" />
                                                <button id="guardCount" onClick={ this.increase } className="plus">{ iconPlus }</button>
                                                <button id="guardCount" onClick={ this.decrease } className="minus">{ iconMinus }</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label>חובשים</label>
                                            <div className="quantity">
                                                <input onChange={this.handleInputChange} id="medicCount" value={ this.state.medicCount } className="small" type="text" />
                                                <button id="medicCount" onClick={ this.increase } className="plus">{ iconPlus }</button>
                                                <button id="medicCount" onClick={ this.decrease } className="minus">{ iconMinus }</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="btn-container double">
                                <div className={"error-container " + (this.state.showError ? 'show' : '')}>
                                    <p>
                                        שגיאה - פרטים חסרים מסומנים <span>באדום</span>
                                    </p>
                                </div>
                                <button className="btn big" onClick={this.nextStage} type="submit">הבא</button>
                            </div>
                        </div>

                        <div className={"stage-2 " + (this.state.stage === "2" ? 'show' : '')}>
                            <table className="list-table free-workers"> 
                                <thead>
                                    <tr>
                                        <th>שם המאבטח</th>
                                        <th>כתובת</th>
                                        <th>קירבה לאיזור הטיול</th>
                                        <th>פלאפון</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.freeGuards.map(item => {
                                            return(
                                                <tr className={ this.state.guards.includes(item) ? 'active' : '' } onClick={() => this.selectGuards(item) }>
                                                    <td>{ item.fullName }</td>
                                                    <td>{ item.address }</td>
                                                    <td>{ item.distance } ק"מ</td>
                                                    <td>{ item.phone }</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                            <div className="btn-container double">
                                <button className="btn big" onClick={this.prevStage} type="submit">הקודם</button>
                                <div className={"error-container " + (this.state.showError ? 'show' : '')}>
                                    <p>
                                        שגיאה - חסרים מאבטחים <span>באדום</span>
                                    </p>
                                </div>
                                <button className="btn big" onClick={this.nextStage} type="submit">הבא</button>
                            </div>
                        </div>

                        <div className={"stage-3 " + (this.state.stage === "3" ? 'show' : '')}>
                            <table className="list-table free-workers"> 
                                <thead>
                                    <tr>
                                        <th>שם המאבטח</th>
                                        <th>כתובת</th>
                                        <th>קירבה לאיזור הטיול</th>
                                        <th>פלאפון</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.freeMedics.map(item => {
                                            return(
                                                <tr className={ this.state.medics.includes(item) ? 'active' : '' } onClick={() => this.selectMedics(item) }>
                                                    <td>{ item.fullName }</td>
                                                    <td>{ item.address }</td>
                                                    <td>{ item.distance } ק"מ</td>
                                                    <td>{ item.phone }</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                            <div className="btn-container double">
                                <button className="btn big" onClick={this.prevStage} type="submit">הקודם</button>
                                <div className={"error-container " + (this.state.showError ? 'show' : '')}>
                                    <p>
                                        שגיאה - חסרים חובשים <span>באדום</span>
                                    </p>
                                </div>
                                <button className="btn big" onClick={this.nextStage} type="submit">הבא</button>
                            </div>
                        </div>

                        <div className={"stage-4 " + (this.state.stage === "4" ? 'show' : '')}>
                            <div className="review-trip">
                                <div className="right">
                                    <div className="block">
                                        <h1>גוף מוציא טיול</h1>
                                        <p>{ this.state.tripSender }</p>
                                    </div>
                                    <div className="block">
                                        <h1>שם בית הספר</h1>
                                        <p>{ this.state.school }</p>
                                    </div>
                                    <div className="block">
                                        <h1>כיתה</h1>
                                        <p>{ this.state.class }</p>
                                    </div>
                                    <div className="block">
                                        <h1>עיר</h1>
                                        <p>{ this.state.city }</p>
                                    </div>
                                    <div className="block">
                                        <h1>כתובת</h1>
                                        <p>{ this.state.address }</p>
                                    </div>
                                    <div className="block">
                                        <h1>כתובת התייצבנות</h1>
                                        <p>{ this.state.meetAddress }</p>
                                    </div>
                                </div>

                                <div className="seperator"></div>
                                <div className="left">
                                    <div className="block">
                                        <h1>איזור הטיול</h1>
                                        <p>{ this.state.address }</p>
                                    </div>
                                    <div className="block">
                                        <h1>תאריך</h1>
                                        <p>{ this.state.startDate } - { this.state.finishDate }</p>
                                    </div>
                                    <div className="block">
                                        <h1>שעת התייצבות</h1>
                                        <p>{ this.state.hour }</p>
                                    </div>
                                    <div className="block">
                                        <h1>איש קשר</h1>
                                        <p>{ this.state.contact }</p>
                                    </div>
                                    <div className="block">
                                        <h1>מאבטחים</h1>
                                        <p>{ this.state.guardCount }</p>
                                    </div>
                                    <div className="block">
                                        <h1>חובשים</h1>
                                        <p>{ this.state.medicCount }</p>
                                    </div>
                                </div>
                            </div>

                            <div className="btn-container double">
                                <button className="btn big" onClick={this.prevStage} type="submit">הקודם</button>
                                <button className="btn big finish" onClick={this.postForm} type="submit">סיים</button>
                            </div>
                        </div>
                    </form>
                </div>
            </>
        )
    }
}

export default newTrip