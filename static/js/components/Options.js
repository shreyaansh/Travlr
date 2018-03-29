import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"

var option_div = document.createElement('div');

class Options extends React.Component {

    constructor (props) {
        super(props);
        this.addLocation = this.addLocation.bind(this);
        this.addHotel = this.addHotel.bind(this);
        // this.generateOptions = this.generateOptions.bind(this);
        this.state = {
            hotelData : null
        }
    }

    // componentDidMount() {
    //     this.generateOptions();
    // }
    
    generateOptions() {
        option_div.id = 'hotel_options';
        var payload = this.props.hotels;

        for(var key in payload.data) {
            var location = payload.data[key];
            console.log(location);
            var params = {"location_name" : location.toString()};
            this.addLocation(params, location['hotels']);
        }

        console.log('DIV:' + option_div);
        console.log('DIVstr:' + option_div.innerHTML);
        return (option_div);
        // this.setState({hotelData: [option_div]});
    }

    addLocation(params, hotels) {
        console.log(hotels);

        var location_div = document.createElement('div');
        location_div.className = 'row';

        var innerdiv01 = document.createElement('div');
        innerdiv01.className = 'card white col s12 m12';

        var innerdiv02 = document.createElement('div');
        innerdiv02.className = 'card-content black-text';

        var location_name = document.createElement('span');
        location_name.className = 'card-title';
        location_name.id = 'location_name';
        location_name.innerHTML = params.location_name.toString();

        innerdiv02.appendChild(location_name);

        //Create multiple hotel divs here
         for(var key in hotels){
             var hotel = hotels[key];
             console.log('HOTEL:' + hotel['name']);
            var h_params = {};
            h_params['hotel_name'] = hotel['name'];
            h_params['hotel_address'] = hotel['formatted_address'];
            h_params['hotel_website'] = hotel['website'];
            h_params['hotel_phone'] = hotel['formatted_phone_number'];
            h_params['hotel_rating'] = hotel['rating'];

            innerdiv02.appendChild(this.addHotel(h_params));
        }

        innerdiv01.appendChild(innerdiv02);
        location_div.appendChild(innerdiv01);
        option_div.appendChild(location_div);
    }

    addHotel(params) {
        var hotel_div = document.createElement('div');
        hotel_div.className = 'row';

        var innerdiv01 = document.createElement('div');
        innerdiv01.className = 'card white col s12 m12';

        var innerdiv02 = document.createElement('div');
        innerdiv02.className = 'card-content black-text';

        var hotel_name = document.createElement('span');
        hotel_name.className = 'card-title';
        hotel_name.id = 'hotel_name';
        hotel_name.innerHTML = params.hotel_name;

        var hotel_address = document.createElement('p');
        hotel_address.id = 'hotel_address';
        hotel_address.innerHTML = "<b>Address: </b>" + params.hotel_address;

        var hotel_website = document.createElement('p');
        hotel_website.id = 'hotel_website';
        hotel_website.innerHTML = "<b>Website: </b>" + params.hotel_website;

        var hotel_phone = document.createElement('p');
        hotel_phone.id = 'hotel_phone';
        hotel_phone.innerHTML = "<b>Phone: </b>" + params.hotel_phone;

        var hotel_rating = document.createElement('p');
        hotel_rating.id = 'hotel_rating';
        hotel_rating.innerHTML = "<b>Rating: </b>" + params.hotel_rating;

        // Add to DIVs
        innerdiv02.appendChild(hotel_name);
        innerdiv02.appendChild(hotel_address);
        innerdiv02.appendChild(hotel_website);
        innerdiv02.appendChild(hotel_phone);
        innerdiv02.appendChild(hotel_rating);

        innerdiv01.appendChild(innerdiv02);
        hotel_div.appendChild(innerdiv01);

        return hotel_div;
    }

    render() {
        return (
            <div id="options">
                <h2 id="opt_tile">Let's make your Itinerary.</h2>
                {[this.generateOptions()].map((data) => <div>{data}</div>)}
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
        hotels: centralReducer.hotels
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);
