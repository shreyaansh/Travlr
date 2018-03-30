import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import selectHotel from "../actions/action_select_hotel"

class ItineraryHotel extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="card white col s12 m12" id="hotel_card">
                    <div className="card-content black-text">
                        <span className="card-title" id="hotel_name">{this.props.hotel_data['name']}</span>
                        <p id="hotel_address">{this.props.hotel_data['formatted_address']}</p>
                        <p id="hotel_website"><b>Website: </b>{this.props.hotel_data['website']}</p>
                        <p id="hotel_phone"><b>Phone: </b>{this.props.hotel_data['formatted_phone_number']}</p>
                        <p id="hotel_rating"><b>Rating: </b>{this.props.hotel_data['rating']}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(ItineraryHotel);
