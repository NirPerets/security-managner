import { Component } from "react";
import userIcon from '../../Icons/iconUser'
import passwordIcon from '../../Icons/iconPassword'
import { History, Redirect }  from 'react-router-dom'

class ManagerLogin extends Component {
    
    state = {
        username: '',
        password: '',
        passWrite: false,
        emailWrite: false,
        isValidate: false,
        showError: false,
        error: '',
    }

    handleEmail = (e) => {
        this.setState({username: e.target.value})

    }

    emailInput = () => {
        this.setState(prevState => ({
            emailWrite: !prevState.emailWrite
          }));
    }

    handlePassword = (e) => {
        this.setState({password: e.target.value})
    }

    passwordInput = () => {
        this.setState(prevState => ({
            passWrite: !prevState.passWrite
          }));
    }

    submitForm = async (e) => {
        e.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        };

        fetch('/login', requestOptions)
        .then(async response => {
            const data = await response.json()

            if(data._id != null) {
                this.props.setUser(data)
                localStorage.setItem('token', data.token )
                window.location.href = "/manager/home"
            } else {
                this.setState({ error: 'משתמש לא קיים או סיסמה שגויה'})
            }
        })
    }

    render() {
        return(
            <div className="fade">
                <h1>התחברות מנהל</h1>
                <form onSubmit={this.submitForm}>
                    <div className={
                        "input-row " + (this.state.emailWrite ? 'focused ' : '') +
                        (this.state.username != '' ? 'focused' : '')
                        }>
                        <div className="icon-container">
                            { userIcon }
                        </div>
                        <div className="input-container">

                            <label>שם החברה</label>
                            <input value={this.state.email} 
                                onFocus={this.emailInput}
                                onBlur={this.emailInput} 
                                onChange={ this.handleEmail } />

                        </div>
                    </div>

                    <div className={
                        "input-row " + (this.state.passWrite ? 'focused ' : '') +
                        (this.state.password != '' ? 'focused' : '')
                        }>
                        <div className="icon-container">
                            { passwordIcon }
                        </div>
                        <div className="input-container">

                            <label>סיסמא</label>
                            <input type="password" value={this.state.password} 
                            onFocus={this.passwordInput} 
                            onBlur={this.passwordInput} 
                            onChange={ this.handlePassword } />
                        </div>
                    </div>

                    <div className={"error-container " + (this.state.showError ? 'show' : '')}>{ this.state.error }</div>
                    <button type="submit" className="submit">התחבר</button>
                </form>
            </div>
        )
    }
}

export default ManagerLogin;