import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import Hotel from "./Hotel"

class ItinLocation extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        var locations = this.props.locations;
        var hotels = [];
        Object.keys(locations[this.props.location_name].hotels).forEach((hotel) => hotels.push(hotel));
        return (
            <div className="row">
                <div className="col s12 m12">
                    <div className="card white" id="location_card">
                        <div className="card-content black-text">
                            <span className="card-title"><b>{this.props.location_name.toUpperCase()}</b></span>
                            <h5>Select a Hotel</h5>
                            <br />
                            <div id="hotel_cards_div">
                                {hotels.map((hotel) => <Hotel key={hotel} hotel_data={locations[this.props.location_name].hotels[hotel]}/>)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ItinLocation);
