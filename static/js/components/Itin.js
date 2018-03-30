import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ItinLocations from '../temp_containers/ItinLocations'

class Itin extends React.Component {
    constructor (props) {
        super(props);
    }

    
    render() {
        var mockItin = {

        }

        var locations = mockItin;
        console.log(locations);
        return (
            <div id="options">
                <h2 id="opt_tile">Let's make your Itinerary.</h2>
                {locations.map((location) => <Location key={location} location_name={location}/>)}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        
    }
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Itin);