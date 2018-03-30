import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import selectHotel from "../actions/action_select_hotel"
import selectEvent from "../actions/action_select_event"
import unselectEvent from "../actions/action_unselect_event"

class ItineraryEvent extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="card white col s12 m12" id="event_card">
                    <div className="card-content black-text">
                        <span className="card-title" id="event_name">{this.props.event_data['title']}</span>
                        <p id="event_time"><b>Time: </b>{this.props.event_data['start_time']}</p>
                        <p id="event_desc">{this.props.event_data['description']}</p>
                        <br />
                        <p id="event_venue"><b>{this.props.event_data['venue_name']}</b></p>
                        <p id="event_address"><b>Address: </b>{this.props.event_data['venue_address']}</p>
                        <p id="event_url"><b>Website: </b>{this.props.event_data['venue_url']}</p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({});
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ItineraryEvent);
