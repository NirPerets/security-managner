import { Component } from "react";
import { NavLink } from 'react-router-dom'
import Logo from '../../logo.png'
import iconHome from '../../Icons/iconHome'
import iconTravel from '../../Icons/iconTravel'
import iconWorkers from '../../Icons/iconWorkers'
import iconPlus from '../../Icons/iconPlus'
import iconSettings from '../../Icons/iconSettings'

class Sidebar extends Component {
    render() {
        return(
            <>
                <div className="sidebar">
                    <div className="logo-container">
                    </div>

                    <div className="menu five">
                        <li>
                            <NavLink activeClassName="active" to="/manager/home">
                                <div className="icon">{ iconHome }</div>
                                <span>ראשי</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to="/manager/trips">
                                <div className="icon">{ iconTravel }</div>
                                <span>רשימת טיולים</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to="/manager/workers">
                                <div className="icon">{ iconWorkers }</div>
                                <span>רשימת עובדים</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to="/manager/newTrip">
                                <div className="icon">{ iconPlus }</div>
                                <span>הוספת טיול חדש</span>
                            </NavLink>
                        </li>
                    </div>

                    <div className="help">
                        <a href="#">עזרה</a>
                        <a href="#">צור קשר</a>
                    </div>
                </div>
            </>
        )
    }
}

export default Sidebar;