import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import printItinerary from "../actions/action_print_itinerary"
import Location from "./Location"
import Itin from "./Itin";

class MyItin extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        var itins = Object.keys(this.props.savedItinerary);
        console.log(itins);

        return (
            <div id="saved_itin" className="container">
                <h2 id="saved_itin_title">Itinerary List</h2>
                {itins.map((itin_id) => <Itin key={itin_id} id={itin_id}/>)}
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
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyItin);
