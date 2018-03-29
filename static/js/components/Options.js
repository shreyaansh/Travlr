import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import Location from "./Location"

class Options extends React.Component {

    constructor (props) {
        super(props);
        this.locationList = this.locationList.bind(this);
        // this.state = {
        //     locations: []
        // }
    }

    // componentDidMount() {
    //     this.locationList();
    // }
    
    locationList() {
        var locations = []
        var payload = this.props.items;
        for(var key in payload.data) {
            locations.push(key);
        }
        return locations;
    }

    render() {
        var locations = this.locationList();
        console.log(locations);
        return (
            <div id="options">
                <h2 id="opt_tile">Let's make your Itinerary.</h2>
                {locations.map((location) => <Location key={location} location_name={location}/>)}
            </div>
        );
    }
}

// function addLocation(params, hotels) {
//     var hotel_options = document.getElementById('hotel_options');
//
//     var location_div = document.createElement('div');
//     location_div.className = 'row';
//
//     var innerdiv01 = document.createElement('div');
//     innerdiv01.className = 'card white col s12 m12';
//
//     var innerdiv02 = document.createElement('div');
//     innerdiv02.className = 'card-content black-text';
//
//     var location_name = document.createElement('span');
//     location_name.className = 'card-title';
//     location_name.id = 'location_name';
//     location_name.innerHTML = params.location_name;
//
//     innerdiv02.appendChild(location_name);
//
//     //Create multiple hotel divs here
//     hotels.forEach(function (hotel) {
//         params = {};
//         params['hotel_name'] = hotel.name;
//         params['hotel_address'] = hotel.formatted_address;
//         params['hotel_website'] = hotel.website;
//         params['hotel_phone'] = hotel.formatted_phone_number;
//         params['hotel_rating'] = hotel.rating;
//
//         innerdiv02.appendChild(addHotel(params));
//     })
//
//     hotel_options.appendChild(location_div);
// }
//
// function addHotel(params) {
//     var hotel_div = document.createElement('div');
//     hotel_div.className = 'row';
//
//     var innerdiv01 = document.createElement('div');
//     innerdiv01.className = 'card white col s12 m12';
//
//     var innerdiv02 = document.createElement('div');
//     innerdiv02.className = 'card-content black-text';
//
//     var hotel_name = document.createElement('span');
//     hotel_name.className = 'card-title';
//     hotel_name.id = 'hotel_name';
//     hotel_name.innerHTML = params.hotel_name;
//
//     var hotel_address = document.createElement('p');
//     hotel_address.id = 'hotel_address';
//     hotel_address.innerHTML = "<b>Address: </b>" + params.hotel_address;
//
//     var hotel_website = document.createElement('p');
//     hotel_website.id = 'hotel_website';
//     hotel_website.innerHTML = "<b>Website: </b>" + params.hotel_website;
//
//     var hotel_phone = document.createElement('p');
//     hotel_phone.id = 'hotel_phone';
//     hotel_phone.innerHTML = "<b>Phone: </b>" + params.hotel_phone;
//
//     var hotel_rating = document.createElement('p');
//     hotel_rating.id = 'hotel_rating';
//     hotel_rating.innerHTML = "<b>Rating: </b>" + params.hotel_rating;
//
//     // Add to DIVs
//     innerdiv02.appendChild(hotel_name);
//     innerdiv02.appendChild(hotel_address);
//     innerdiv02.appendChild(hotel_website);
//     innerdiv02.appendChild(hotel_phone);
//     innerdiv02.appendChild(hotel_rating);
//
//     innerdiv01.appendChild(innerdiv02);
//     hotel_div.appendChild(innerdiv01);
//
//     return hotel_div;
// }

const mapStateToProps = ({ centralReducer }) => {
    return ({
        items: centralReducer.items
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);
