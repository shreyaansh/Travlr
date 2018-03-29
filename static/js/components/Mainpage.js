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

    }

    getFormData() {
        var form_div = Array.from($("#form_div input"));
        var stops = [];
        var form_data = {};

        form_div.forEach(function(input){
            if(input.id === "stop_location")
                stops.push(input.value);
            else {
                form_data[input.id] = input.value;
            }
        });

        form_data['stops'] = stops;

        var userInfo = JSON.parse(localStorage.getItem("currentUser"));
        form_data['email'] = userInfo.profileObj.email;

        if(userInfo) {
            console.log(constants.routeUrl);
            console.log(constants.routeUrl + 'travel-form');
            axios.post(constants.routeUrl + "travel-form", form_data).then(res => {
                // console.log(res);
                console.log("FORM_DATA: Submitted", form_data);
                this.props.fetchItems(res);
            });
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
                            <div className="card-content white-text" id="form_div">
                                <span id="form_user_name">Hi, {this.props.nameProp}</span>
                                <span className="card-title">Lets plan your trip.</span>

                                <div className="row">
                                    <div className="input-field col s8">
                                        <input id="from_location" type="text"/>
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
                                        <input id="to_location" type="text"/>
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
                            <div className="card-action orange accent-4">
                                <a onClick={this.getFormData} className="white-text">Generate Itinerary</a>
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
new_stop.innerHTML = "<input id=\"stop_location\" type=\"text\">\n<label for=\"stop_location\">New Sto" +
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
