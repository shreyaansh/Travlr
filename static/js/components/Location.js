import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import Hotel from "./Hotel"
import Event from "./Event"

//Timestamp based unique ids
const uuidv1 = require('uuid/v1');

class Location extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            selectedHotel: ""
        }
        this.handler = this.handler.bind(this);        
    }

    handler(hotel) {
        this.setState({
            selectedHotel: hotel
        });
    }

    render() {
        var locations = this.props.items['data'];
        console.log(this.props.items);
        var hotels = [];
        var identifier = uuidv1();
        Object.keys(locations[this.props.location_name].hotels).forEach((hotel) => hotels.push(hotel));
        var events = locations[this.props.location_name].events.events.event;
        //var weather_summary = locations[this.props.location_name].weather.summary;
        //var weather_temperature = locations[this.props.location_name].weather.temperature;
        //var weather_clothing = locations[this.props.location_name].weather.clothing;
        //var weather_severe = locations[this.props.location_name].weather.severe;

        return (
            <div className="row">
                <div className="col s12 m12">
                    <div className="card white" id="location_card">
                        <div className="card-content black-text">
                            <span className="card-title"><b>{this.props.location_name.toUpperCase()}</b></span>
                            <br />
                            <h5>Clothing for the Weather</h5>
                            <br />
                            <div className="card blue-grey darken-1">
                                <div className="card-content white-text">
                                    {/*<h4>{weather_clothing} - {weather_severe}</h4>
                                    <h5>{weather_summary} - {weather_temperature}&deg;F</h5>*/}
                                </div>
                            </div>
                            <br />
                            <h5>Select a Hotel</h5>
                            <br />
                            <div id="hotel_cards_div">
                                {hotels.map((hotel) => <Hotel action={this.handler} key={hotel} id={hotel.toString()} city={this.props.location_name.toLowerCase()} hotel_data={locations[this.props.location_name].hotels[hotel]}/>)}
                            </div>
                            <br />
                            <h5>Select Events</h5>
                            <br />
                            <div id="event_cards_div">
                                {events.map((event) => <Event key={event['id']} id={event['id']} city={this.props.location_name.toLowerCase()} event_data={event} />)}
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
        items: centralReducer.items
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Location);
