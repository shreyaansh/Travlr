import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import Hotel from "./Hotel"

class Location extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        var locations = this.props.items['data'];
        var hotels = [];
        Object.keys(locations[this.props.location_name].hotels).forEach((hotel) => hotels.push(hotel));
        return (
            <div className="row">
                <div className="col s12 m12">
                    <div className="card white" id="location_card">
                        <div className="card-content black-text">
                            <span className="card-title">{this.props.location_name}</span>
                            {hotels.map((hotel) => <Hotel key={hotel} hotel_data={locations[this.props.location_name].hotels[hotel]}/>)}
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
