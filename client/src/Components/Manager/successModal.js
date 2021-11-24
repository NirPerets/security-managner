import { Component } from "react";
import { Redirect } from "react-router";
import iconCheck from '../../Icons/iconCheck'
import { PDFDownloadLink } from '@react-pdf/renderer'

class SuccessModal extends Component {

    closeModalAndRefresh = () => {
        this.props.closeModal()
        window.location.reload()
    }

    render() {
        return(
            <>
                <div className="small-modal final-screen">
                    <h1>{ this.props.text }</h1>
                    { iconCheck }
                    
                    {
                        this.props.document != null ?
                        (
                            <PDFDownloadLink document={ this.props.document } fileName="trip.pdf">
                                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
                            </PDFDownloadLink>
                        ) : <></>
                    }

                    <button onClick={ this.closeModalAndRefresh } class="btn big">סגור חלון</button>
                </div>
            </>
        )
    }
}

export default SuccessModal