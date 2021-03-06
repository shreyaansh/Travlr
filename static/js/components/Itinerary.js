import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import ItineraryLocation from "./ItineraryLocation"

class Itinerary extends React.Component {

    constructor (props) {
        super(props);
        this.locationList = this.locationList.bind(this);
    }

    locationList() {
        var locations = []
        var payload = this.props.currentSelection.itinerary;

        if(this.props.is_saved) {
            payload = this.props.currentSavedSelection;
        }

        for(var key in payload) {
            locations.push(key);
        }
        return locations;
    }

    render() {
        var locations = this.locationList();
        console.log("locations: ", locations);
        return (
            <div id="itinerary">
                <h2 id="opt_tile">Here's your Itinerary.</h2>
                {locations.map((location) => <ItineraryLocation key={location} is_saved={this.props.is_saved} location_name={location}/>)}
            </div>
        );
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({
        currentSelection: centralReducer.currentSelection,
        currentSavedSelection: centralReducer.currentSavedSelection
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Itinerary);
