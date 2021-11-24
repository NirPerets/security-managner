import { Component } from "react";

class InputRow extends Component {
    
    constructor(props) {
        super(props)
    }

    state = {
        isActive: false,
    }

    handleInputActivation = () => {
        this.setState(prevState => ({
            isActive: !prevState.isActive
        }))
    }

    render() {
        return(
            <>
                <div className={"input-row " + (this.state.isActive ? 'active' : '') + (this.props.isError ? 'error' : '')} >
                    <label>{ this.props.label }</label>
                    <input 
                        id={ this.props.id }
                        value={ this.props.value } 
                        onChange={ this.props.handleInputChange } 
                        onFocus={ this.handleInputActivation } 
                        onBlur={this.handleInputActivation} 
                        type="text" />
                </div>
            </>
        )
    }
} 

export default InputRow