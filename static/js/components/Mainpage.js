import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"

class Mainpage extends React.Component {

    constructor (props) {
        super(props);
        this.getFormData = this.getFormData.bind(this);
        this.validateDates = this.validateDates.bind(this);
    }

    validateDates(total_days, from_date, to_date) {
        var one_day = 1000*60*60*24;
        var f_date = new Date(from_date);
        var t_date = new Date(to_date);

        if(t_date < f_date) {
            window.alert("INVALID DATE RANGE: The to date cannot be greater than from date");
            return false;
        }

        var days = ((t_date - f_date) / one_day) + 1;
        if(days !== total_days) {
            window.alert("INVALID DATE RANGE: The total number of days do not match the date range");
            return false;
        }

        return true;
    }

    getFormData() {
        var form_data = {};
        var stops = [];
        var hotel_prefs = [];
        var event_prefs = [];
        var stop_days = [];
        var stop_data = [];
        var total_days = 0;

        var form_div = Array.from($("#form_div input"));
        form_div.forEach(function(input) {
            if (input.id === "stop_location") {
                stops.push(input.value);
            }
            else {
                form_data[input.id] = input.value;
            }

            if (input.id === "stop_location" || input.id === "from_location" || input.id === "to_location") {
                stop_data.push(input.value);
                var loc_object = {};
                loc_object[input.value] = 0;
                stop_days.push(loc_object);
            }
        });

        // Add Stop Days
        var counter = 0;
        form_div.forEach(function(input){
            if(input.id === "stop_days"){
                total_days += parseInt(input.value);
                stop_days[counter][stop_data[counter]] = input.value;
                counter++;
            }
        });

        form_data['stops'] = stops;
        form_data['stop_days'] = stop_days;
        form_data['total_days'] = total_days;

        var prefHotel = Array.from(document.getElementsByClassName('hotel_pref'));
        var prefEvent = Array.from(document.getElementsByClassName('event_pref'));

        prefHotel.forEach(function (pref) {
           if(pref.checked){
               hotel_prefs.push(pref.labels[0].innerText);
           }
        });
        prefEvent.forEach(function (pref) {
            if(pref.checked){
                event_prefs.push(pref.labels[0].innerText);
            }
        });

        form_data['hotel_prefs'] = hotel_prefs;
        form_data['event_prefs'] = event_prefs;

        var userInfo = JSON.parse(localStorage.getItem("currentUser"));
        form_data['email'] = userInfo.profileObj.email;

        if(userInfo) {
            console.log(constants.routeUrl);
            console.log(constants.routeUrl + 'travel-form');

            // Date Check
            if(this.validateDates(form_data['total_days'], form_data['from_date'], form_data['to_date'])){
                axios.post(constants.routeUrl + "travel-form", form_data).then(res => {
                    // console.log(res);
                    console.log("FORM_DATA: Submitted", form_data);
                    this.props.fetchItems(res);
                });
            } else {
                console.log('INVALID DATE RANGE: Something went wrong!');
            }
        }
        else {
            console.log('FORM_DATA: No user signed in!');
        }


    }

    render() {
        return (
            <div>
                <div className="row" id="main_form">
                    <div className="col s12 m6">
                        <div className="card blue-grey darken-4">
                            <div className="card-content white-text">

                                <span id="form_user_name">Hi, {this.props.nameProp}</span>
                                <span className="card-title">Lets plan your trip.</span>

                                <div id="form_div">
                                    <div className="row">
                                        <div className="input-field col s8">
                                            <input className='autocomplete' id="from_location" type="text"/>
                                            <label htmlFor="from_location">First Stop</label>
                                        </div>
                                        <div className="input-field col s4">
                                            <input id="stop_days" type="text"/>
                                            <label htmlFor="stop_days">Days</label>
                                        </div>
                                    </div>

                                    <div id="stop_fields"></div>
                                    <a className="btn blue-grey lighten-1" id="add_stop" onClick={add_stop_field}>
                                        <i className="material-icons left">add</i>
                                        Add Stop</a>

                                    <div className="row">
                                        <div className="input-field col s8">
                                            <input className='autocomplete' id="to_location" type="text"/>
                                            <label htmlFor="to_location">Last Stop</label>
                                        </div>
                                        <div className="input-field col s4">
                                            <input id="stop_days" type="text"/>
                                            <label htmlFor="stop_days">Days</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s6">
                                            <input id="from_date" type="text" className="datepicker validate"/>
                                            <label htmlFor="from_date">From?</label>
                                        </div>
                                        <div className="input-field col s6">
                                            <input id="to_date" type="text" className="datepicker validate"/>
                                            <label htmlFor="to_date">To?</label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="card-title">Choose your Preferences</span>
                                    <span>Hotel Preferences</span>
                                    <p>
                                        <label>
                                            <input type="checkbox" className="hotel_pref"/>
                                            <span>Cheap</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="hotel_pref"/>
                                            <span>Expensive</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="hotel_pref"/>
                                            <span>Romantic</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="hotel_pref"/>
                                            <span>Downtown</span>
                                        </label>&nbsp;&nbsp;
                                    </p>

                                    <br />
                                    <span>Event Preferences</span>
                                    <p>
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Music</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Comedy</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Food</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Fundraisers</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Art</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Attractions</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Conference</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Sports</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Science</span>
                                        </label>&nbsp;&nbsp;
                                        <label>
                                            <input type="checkbox" className="event_pref"/>
                                            <span>Technology</span>
                                        </label>&nbsp;&nbsp;
                                    </p>
                                </div>
                            </div>
                            <div className="card-action orange accent-4">
                                <a onClick={this.getFormData} className="white-text" id="generateButtonDiv">Generate Itinerary</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col s12 m6">
                        <img
                            className="responsive-img"
                            src="/assets/travel_about_main.jpeg"
                            alt="Travel Anywhere"/>
                    </div>
                    <div className="col s12 m6">
                        <span id="hero_line" className="center-align">TRAVEL MADE EASY</span>
                        <p>Creating and planning a trip requires quite a bit of effort. Looking at
                            places to stay in, attractions and events to go visit, planning packing
                            according to the weather at the time of visit at the locations and many other
                            things. We simplify a lot of the itinerary creation process for you!.</p>
                        <blockquote>
                            <ul id="hero_steps">
                                <li>Enter Locations</li>
                                <li>Select Hotel and Flight Preferences</li>
                                <li>Generate Itinerary!</li>
                            </ul>
                        </blockquote>
                    </div>
                </div>
            </div>
        );
    }
}

function add_stop_field() {
    var parent_div = document.getElementById('stop_fields');
    var stop_field_div = document.createElement('div');
    stop_field_div.className = "row";

    var new_stop = document.createElement('div');
    new_stop.className = 'input-field col s8';
    new_stop.innerHTML = "<input class=\"autocomplete\" id=\"stop_location\" type=\"text\">\n<label for=\"stop_location\">New Sto" +
            "p</label>";

    var stop_days = document.createElement('div');
    stop_days.className = 'input-field col s2';
    stop_days.innerHTML = "<input id=\"stop_days\" type=\"text\">\n<label for=\"stop_days\">Days</label>"

    var remove_btn = document.createElement('div');
    remove_btn.className = "col s2";
    remove_btn.innerHTML = "<a class=\"btn-floating btn-flat red\" id=\"remove_stop\" onclick=\"remove_s" +
                "top_field(this)\"><i class=\"material-icons left\">clear</i></a>";

    stop_field_div.appendChild(new_stop);
    stop_field_div.appendChild(stop_days);
    stop_field_div.appendChild(remove_btn);

    parent_div.appendChild(stop_field_div);
}

const mapStateToProps = ({ centralReducer }) => {
    return ({
        items: centralReducer.items
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({fetchItems}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Mainpage);
