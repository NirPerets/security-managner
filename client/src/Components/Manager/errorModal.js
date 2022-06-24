import { Component } from "react";
import { Redirect } from "react-router";
import iconError from '../../Icons/iconError'

class ErrorModal extends Component {

    closeModalAndRefresh = () => {
        this.props.closeModal()
        window.location.reload()
    }

    render() {
        return(
            <>
                <div className="small-modal final-screen">
                    <h1 class="red">{ this.props.text }</h1>
                    { iconError }
                    <button onClick={ this.closeModalAndRefresh } class="btn big">סגור חלון</button>
                </div>
            </>
        )
    }
}

export default ErrorModal