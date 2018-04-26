import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import ItineraryHotel from "./ItineraryHotel"
import ItineraryEvent from "./ItineraryEvent"
//Timestamp based unique ids
const uuidv1 = require('uuid/v1');

class ItineraryLocation extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        var hotel = this.props.currentSelection.itinerary[this.props.location_name.toLowerCase()].selectedHotel;
        var events = [];
        Object.keys(this.props.currentSelection.itinerary[this.props.location_name.toLowerCase()].selectedEvents).forEach((event) => events.push(event));

        return (
            <div className="row">
                <div className="col s12 m12">
                    <div className="card white" id="location_card">
                        <div className="card-content black-text">
                            <span className="card-title"><b>{this.props.location_name.toUpperCase()}</b></span>
                            <h5>Your Hotel</h5>
                            <br />
                            <div id="itinerary_hotel_cards_div">
                                <ItineraryHotel hotel_data={hotel}/>
                            </div>
                            <h5>Events you are Interested In</h5>
                            <br />
                            <div id="itinerary_event_cards_div">
                                {events.map((event) => <ItineraryEvent key={uuidv1()} event_data={this.props.currentSelection.itinerary[this.props.location_name.toLowerCase()].selectedEvents[event]}/>)}
                            </div>
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ItineraryLocation);
