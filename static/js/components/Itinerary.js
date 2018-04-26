import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import ItineraryLocation from "./ItineraryLocation"

class Itinerary extends React.Component {

    constructor (props) {
        super(props);
        this.locationList = this.locationList.bind(this);
    }

    locationList() {
        var locations = []
        var payload = this.props.currentSelection.itinerary;
        for(var key in payload) {
            locations.push(key);
        }
        return locations;
    }

    render() {
        var locations = this.locationList();
        var pl = this.props.currentSelection.itinerary;
        var doc = new jsPDF();
        doc.text("Your Itinerary:",10,10);
        var y = 20;
        jQuery.each(pl, function(loc, locs){
            doc.text(loc,10,y);
            y+=10;
            doc.text("Hotel Information:",20,y);
            y+=10;
            var hn = locs.selectedHotel.name;
            doc.text(hn,30,y);
            y+=10;
            var ha = locs.selectedHotel.formatted_address;
            doc.text(ha,40,y);
            y+=10;
            var se = locs.selectedEvents;
            doc.text("Events you are interested in:",20,y);
            y+=10;
            jQuery.each(se,function(eid,einf){
                var et = einf.title;
                doc.text(et, 30, y);
                y+=10;
                var en = einf.venue_name;
                doc.text(en,40,y);
                y+=10
                var est = einf.start_time;
                doc.text(est,40,y);
                y+=10;
            });
        });
        doc.save("itin.pdf");
        return (
            <div id="itinerary">
                <h2 id="opt_tile">Here's your Itinerary.</h2>
                {locations.map((location) => <ItineraryLocation key={location} location_name={location}/>)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Itinerary);
