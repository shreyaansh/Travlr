import React from 'react'

 const Mainpage = (props) => {
    return(
        <div className="row" id="main_htmlForm">
        <div className="col s12 m6">
            <div className="card blue-grey darken-4">
                <div className="card-content white-text">
                    <span className="card-title">What's your plan?</span>

                    <div className="input-field">
                        <input id="from_location" type="text" />
                        <label htmlFor="from_location">Where From?</label>
                    </div>
                    <div id="stop_fields"></div>
                    <a className="btn blue-grey lighten-1" id="add_stop" onClick={add_stop_field}><i className="material-icons left">add</i> Add Stop</a>
                    <div className="input-field">
                        <input id="to_location" type="text" />
                        <label htmlFor="to_location">Where To?</label>
                    </div>

                    <div className="input-field">
                        <input id="from_date" type="date" />
                        <label htmlFor="from_date">From?</label>
                    </div>
                    <div className="input-field">
                        <input id="to_date"type="date" /> 
                        <label htmlFor="to_date">To?</label>
                    </div>
                </div>
                <div className="card-action orange accent-4">
                    <a href="#" className="white-text">Generate Itinerary</a>
                </div>
            </div>
        </div>
    </div>
    );
}

// Functions
function add_stop_field() {
	var parent_div = document.getElementById('stop_fields');
	var stop_field_div = document.createElement('div');
	stop_field_div.className="row";
	var new_stop = document.createElement('div');
	new_stop.className = 'input-field col s10';
	new_stop.innerHTML = "<input id=\"stop_location\" type=\"text\">\n<label for=\"stop_location\">New Stop</label>";

	var remove_btn = document.createElement('div');
	remove_btn.className = "col s2";
	remove_btn.innerHTML = "<a class=\"btn-floating red\" id=\"remove_stop\" onClick=\"remove_stop_field(this)\"><i class=\"material-icons left\">clear</i></a>";

	stop_field_div.appendChild(new_stop);
	stop_field_div.appendChild(remove_btn);

	parent_div.appendChild(stop_field_div);
}
function remove_stop_field(field) {
	var parent_div = document.getElementById('stop_fields');
	parent_div.removeChild(field.parentNode.parentNode);
}

export default Mainpage;