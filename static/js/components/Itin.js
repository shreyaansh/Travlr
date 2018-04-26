import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import printItinerary from "../actions/action_print_itinerary"
import Location from "./Location"

import view_saved_itin from '../actions/action_view_saved_itin'

class Itin extends React.Component {

    constructor (props) {
        super(props);
        this.onViewClick = this.onViewClick.bind(this);
    }

    onViewClick() {
        this.props.view_saved_itin(this.props.savedItinerary[this.props.id]);
    }

    render() {
        var currentItin = JSON.parse(this.props.savedItinerary[this.props.id]);
        console.log(currentItin);

        var locations = Object.keys(currentItin);
        var itin_title = (locations[0] + " TO " + locations[locations.length - 1]).toUpperCase();

        return (
            <div className="col s12 m12">
                <div className="card white" id="itin_card">
                    <div className="row">
                        <div className="card-content black-text">
                            <span className="card-title" id="itin_title"><i className="material-icons left">compare_arrows</i>{itin_title}</span>
                        </div>
                        <div className="card-action">
                            <a className="btn green" onClick={this.onViewClick}>View Itinerary</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({
        savedItinerary : centralReducer.savedItinerary
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({view_saved_itin}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Itin);
