import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";

class DeveloperPage extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {

        return (
            <div className="row">
                <div className="col s12 m12">
                    <div className="card white" id="location_card">
                        <div className="card-content black-text">
                            <span className="card-title"><b>{this.props.location_name.toUpperCase()}</b></span>
                            <h5>Select a Hotel</h5>
                            <br />
                            <div id="hotel_cards_div">
                                {hotels.map((hotel) => <Hotel action={this.handler} key={hotel} id={hotel.toString()} city={this.props.location_name.toLowerCase()} hotel_data={locations[this.props.location_name].hotels[hotel]}/>)}
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperPage);
