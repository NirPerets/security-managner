import { Component } from "react";
import Bell from '../Icons/iconBell'

class TopHeader extends Component {
    render() {
        return(
            <>
                <div className="header">
                    <div className="breadcrumbs">
                        <h1>לוח בקרה {" > "} { localStorage.getItem('currentPage') }</h1>
                    </div>
                    <div className="profile">
                        <h1>G One</h1>
                        <button className="bell">{ Bell }</button>
                    </div>
                </div>
            </>
        )
    }
}

export default TopHeader;