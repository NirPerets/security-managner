import { Component } from "react";
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';


class MapInput extends Component {

    state = {
        address: '',
        latLng: '',
        isActive: false,
    }
    
    handleChange = address => {
        this.setState({address})
      };

    handleSelect = (address) => {
        geocodeByAddress(address)
        .then(async (results) => {
            this.setState({
                address: results[0].formatted_address,
            })
            this.props.handleMapChange(results)
        })
        .catch(error => console.error('Error', error));
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
                    <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                        onFocus={ this.handleInputActivation } 
                        onBlur={this.handleInputActivation} 
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <input
                            {...getInputProps({
                                placeholder: 'חיפוש מקומות ...',
                                className: 'location-search-input',
                            })}
                            />
                            <div className="autocomplete-dropdown-container">
                            {loading && <div>טוען...</div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                ? 'suggestion-item--active'
                                : 'suggestion-item';
                                const style = suggestion.active
                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                <div
                                    {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style,
                                    })}
                                >
                                    <span>{suggestion.description}</span>
                                </div>
                                );
                            })}
                            </div>
                        </div>
                        )}
                    </PlacesAutocomplete>
                </div>
            </>
        )
    }
}

export default MapInput;