import React from 'react'

const Mainpage = (props) => {
    return (
        <div>
            <div className="row" id="main_form">
                <div className="col s12 m4">
                    <div className="card blue-grey darken-4">
                        <div className="card-content white-text">
                            <span className="card-title">What's your plan?</span>

                            <div className="input-field">
                                <input id="from_location" type="text"/>
                                <label htmlFor="from_location">Where From?</label>
                            </div>
                            <div id="stop_fields"></div>
                            <a className="btn blue-grey lighten-1" id="add_stop" onClick={add_stop_field}>
                                <i className="material-icons left">add</i>
                                Add Stop</a>
                            <div className="input-field">
                                <input id="to_location" type="text"/>
                                <label htmlFor="to_location">Where To?</label>
                            </div>

                            <div className="row">
                                <div className="input-field col s6">
                                    <input id="from_date" type="date"/>
                                </div>
                                <div className="input-field col s6">
                                    <input id="to_date" type="date"/>
                                </div>
                            </div>

                        </div>
                        <div className="card-action orange accent-4">
                            <a href="#" className="white-text">Generate Itinerary</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col s12 m6">
                    <img
                        className="responsive-img"
                        src="../assets/travel_about_main.jpeg"
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

function add_stop_field() {
    var parent_div = document.getElementById('stop_fields');
    var stop_field_div = document.createElement('div');
    stop_field_div.className = "row";
    var new_stop = document.createElement('div');
    new_stop.className = 'input-field col s10';
    new_stop.innerHTML = "<input id=\"stop_location\" type=\"text\">\n<label for=\"stop_location\">New Sto" +
            "p</label>";

    var remove_btn = document.createElement('div');
    remove_btn.className = "col s2";
    remove_btn.innerHTML = "<a className=\"btn-floating btn-flat red\" id=\"remove_stop\" onclick=\"remove_s" +
            "top_field(this)\"><i className=\"material-icons left\">clear</i></a>";

    stop_field_div.appendChild(new_stop);
    stop_field_div.appendChild(remove_btn);

    parent_div.appendChild(stop_field_div);
}

export default Mainpage;