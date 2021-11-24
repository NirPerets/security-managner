import { Component } from 'react'
import loginBG from '../../login-bg.jpg'
import usersIcon from '../../Icons/iconUsers'
import emailIcon from '../../Icons/iconEmail'
import passwordIcon from '../../Icons/iconPassword'
import { Redirect, Link }  from 'react-router-dom'

class Register extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        passWrite: false,
        emailWrite: false,
        nameWrite: false,
        errors: [],
        showError: false,
        error: ''
    }

    handleName = (e) => {
        this.setState({name: e.target.value})

    }

    nameInput = () => {
        this.setState(prevState => ({
            nameWrite: !prevState.nameWrite
          }));
    }

    handleEmail = (e) => {
        this.setState({email: e.target.value})

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

    validation = () => {

    }

    submitForm = async () => {
        await this.validation()

        if(this.state.errors.length > 0) {
            this.setState({ showError: true })
            return 0;
        } 

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: this.state.name,
                email: this.state.email,
                password: this.state.password,
            })
        };

        fetch('/register', requestOptions)
        .then(response => response.json())
        .then(data => {
           console.log(data)
           if(data.message === 'User already exists') {
               this.setState({
                   showError: true,
                    error: 'המשתמש כבר קיים'
               })
           } else {
                return <Redirect to="/login" />
           }
        }) 
    }

    render() {
        return(
            <>
                <img src={ loginBG } class="login-bg" />
                <div className="login-page flex-center">
                    <div className="login-container">
                        <div className="login-inside">
                            <div className="fade">
                                <h1>הרשמה</h1>
                                <form onSubmit={e => e.preventDefault()}>
                                    <div className={
                                    "input-row " + (this.state.nameWrite ? 'focused ' : '') +
                                    (this.state.name != '' ? 'focused' : '')
                                    }>
                                        <div className="icon-container">
                                            { usersIcon }
                                        </div>
                                        <div className="input-container">

                                            <label>שם חברה</label>
                                            <input value={this.state.name} 
                                                onFocus={this.nameInput}
                                                onBlur={this.nameInput} 
                                                onChange={ this.handleName } />

                                        </div>
                                    </div>

                                    <div className={
                                    "input-row " + (this.state.emailWrite ? 'focused ' : '') +
                                    (this.state.email != '' ? 'focused' : '')
                                    }>
                                        <div className="icon-container">
                                            { emailIcon }
                                        </div>
                                        <div className="input-container">

                                            <label>אימייל</label>
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
                            <button onClick={this.submitForm} type="submit" className="submit">הירשם</button>
                        </form>
                    </div>
                    </div>
                        <div className="login-footer">
                            <Link to="/login">התחבר</Link>
                            <Link to="#">תמיכה טכנית</Link>
                            <Link to="#">צור קשר</Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Register