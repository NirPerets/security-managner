import { Component } from "react";
import iconID from '../../Icons/iconID'
import iconPhone from '../../Icons/iconPhone'

class WorkerLogin extends Component {
    
    state = {
        userID: '',
        phone: '',
        idWrite: false,
        phoneWrite: false,
        isValidate: false,
        showError: false,
        error: '',
    }

    handleId = (e) => {
        this.setState({userID: e.target.value})

    }

    idInput = () => {
        this.setState(prevState => ({
            idWrite: !prevState.idWrite
          }));
    }

    handlePhone = (e) => {
        this.setState({phone: e.target.value})
    }

    phoneInput = () => {
        this.setState(prevState => ({
            phoneWrite: !prevState.phoneWrite
          }));
    }

    validation = () => {

    }

    submitForm = async (e) => {
        e.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: this.state.userID,
                phone: this.state.phone,
            })
        };

        fetch('/worker/login', requestOptions)
        .then(async response => {
            if(response.status == '403') return this.setState({ 
                error: 'עובד לא קיים או פרטים שגויים',
                showError: true,
                userID: '',
                phone: ''
            })
            const data = await response.json()

            if(data != null) {
                this.props.setUser(data)
                localStorage.setItem('worker', data._id)
                window.location.href = "/worker"
            } else {
                this.setState({ error: 'עובד לא קיים או פרטים שגויים', showError: true})
            }
        })
    }

    render() {
        return(
            <div className="fade">
                <h1>התחברות עובד</h1>
                <form onSubmit={ this.submitForm }>
                    <div className={
                        "input-row " + (this.state.idWrite ? 'focused ' : '') +
                        (this.state.userID != '' ? 'focused' : '')
                        }>
                        <div className="icon-container">
                            { iconID }
                        </div>
                        <div className="input-container">

                            <label>תעודת זהות</label>
                            <input value={this.state.userID} 
                                onFocus={this.idInput}
                                onBlur={this.idInput} 
                                onChange={ this.handleId } />

                        </div>
                    </div>

                    <div className={
                        "input-row " + (this.state.phoneWrite ? 'focused ' : '') +
                        (this.state.phone != '' ? 'focused' : '')
                        }>
                        <div className="icon-container">
                            { iconPhone }
                        </div>
                        <div className="input-container">

                            <label>מספר פלאפון</label>
                            <input type="password" value={this.state.phone} 
                            onFocus={this.phoneInput} 
                            onBlur={this.phoneInput} 
                            onChange={ this.handlePhone } />

                        </div>
                    </div>

                    <div className={"error-container " + (this.state.showError ? 'show' : '')}>{ this.state.error }</div>
                    <button type="submit" className="submit">התחבר</button>
                </form>
            </div>
        )
    }
}

export default WorkerLogin;