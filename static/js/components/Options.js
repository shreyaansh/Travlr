import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import printItinerary from "../actions/action_print_itinerary"
import Location from "./Location"

class Options extends React.Component {

    constructor (props) {
        super(props);
        this.locationList = this.locationList.bind(this);
        this.onGenerateClick = this.onGenerateClick.bind(this);
    }

    locationList() {
        var locations = []
        var payload = this.props.items;
        for(var key in payload.data) {
            locations.push(key);
        }
        return locations;
    }

    onGenerateClick() {
        this.props.printItinerary(this.props.currentSelection);
    }

    render() {
        var locations = this.locationList();
        // console.log(locations);
        return (
            <div id="options">
                <h2 id="opt_tile">Let's make your Itinerary.</h2>
                {locations.map((location) => <Location key={location} location_name={location}/>)}

                <a className="btn green" onClick={this.onGenerateClick}>Generate Itinerary</a>
            </div>
        );
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({
        items: centralReducer.items,
        currentSelection: centralReducer.currentSelection
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({printItinerary}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);
