import { Component } from 'react'
import loginBG from '../../login-bg.jpg'
import ManagerLogin from './ManagerLogin'
import WorkerLogin from './WorkerLogin'

class Login extends Component {

    state = {
        showManager: true,
    }

    activateManager = () => {
        this.setState({showManager : true})
    }

    activateWorker = () => {
        this.setState({showManager: false})
    }

    render() {
        return(
            <>
                <img src={ loginBG } class="login-bg" />
                <div className="login-page flex-center">
                    <div className="login-container">
                        <div className="login-heading">
                            <button onClick={ this.activateManager } className={"select " + (this.state.showManager ? 'active' : '')}>מנהל</button>
                            <button onClick={ this.activateWorker } className={"select " + (!this.state.showManager ? 'active' : '')}>עובד</button>
                        </div>
                        <div className="login-inside">
                            { this.state.showManager ? <ManagerLogin setUser={ this.props.setUser } /> : <WorkerLogin setUser={ this.props.setUser } />}
                        </div>
                        <div className="login-footer">
                            <a href="#">תמיכה טכנית</a>
                            <a href="#">צור קשר</a>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Login