import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import ItineraryLocation from "./ItineraryLocation"

class SavedItinerary extends React.Component {

    constructor (props) {
        super(props);
        this.locationList = this.locationList.bind(this);
    }

    locationList() {
        var locations = []
        var payload = this.props.savedSelection.itinerary;
        for(var key in payload) {
            locations.push(key);
        }
        return locations;
    }

    render() {
        var locations = this.locationList();

        return (
            <div id="itinerary">
                <h2 id="opt_tile">Here's your Itinerary.</h2>
                {locations.map((location) => <ItineraryLocation key={location} location_name={location}/>)}
            </div>
        );
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({
        currentSelection: centralReducer.currentSelection
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedItinerary);
