import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import ItineraryHotel from "./ItineraryHotel"
import ItineraryEvent from "./ItineraryEvent"

class ItineraryLocation extends React.Component {

    constructor (props) {
        super(props);
        this.selectEvent = this.selectEvent.bind(this);
    }

    selectEvent (event) {
        var event_data = null;
        if(this.props.is_saved){
            event_data = this.props.currentSavedSelection[this.props.location_name.toLowerCase()].selectedEvents[event];
        } else {
            event_data = this.props.currentSelection.itinerary[this.props.location_name.toLowerCase()].selectedEvents[event];
        }
        return (<ItineraryEvent key={event['id']} event_data={event_data}/>);
    }

    render() {
        var hotel = null;
        var events = [];

        if(this.props.is_saved) {
            hotel = this.props.currentSavedSelection[this.props.location_name.toLowerCase()].selectedHotel;
            Object.keys(this.props.currentSavedSelection[this.props.location_name.toLowerCase()].selectedEvents).forEach((event) => events.push(event));
        } else {
            hotel = this.props.currentSelection.itinerary[this.props.location_name.toLowerCase()].selectedHotel;
            Object.keys(this.props.currentSelection.itinerary[this.props.location_name.toLowerCase()].selectedEvents).forEach((event) => events.push(event));
        }

        //BACKUP WORKING
        // var hotel = this.props.currentSelection.itinerary[this.props.location_name.toLowerCase()].selectedHotel;
        // var events = [];
        // Object.keys(this.props.currentSelection.itinerary[this.props.location_name.toLowerCase()].selectedEvents).forEach((event) => events.push(event));

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
                                {events.map(this.selectEvent)}
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
        currentSelection: centralReducer.currentSelection,
        currentSavedSelection: centralReducer.currentSavedSelection
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ItineraryLocation);
