import React from 'react';
import axios from "axios";
import constants from "../../constants"

const Feedback = (props) => {
    return (
        <div>
            <div className="fixed-action-btn">
                <a className="btn-floating btn-large blue-grey darken-3 modal-trigger" href="#feedback_modal">
                    <i className="large material-icons">message</i>
                </a>
            </div>

            <div id="feedback_modal" className="modal">
                <div className="modal-content">
                    <h4>Leave us some Feedback!</h4>
                    <textarea id="feedback_input"></textarea>
                </div>
                <div className="modal-footer">
                    <a onClick={getFeedbackData} className="modal-action modal-close waves-effect waves-green btn-flat">Send</a>
                    <a href="#" className="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
        </div>
    );
}

function getFeedbackData() {
    var message = document.getElementById('feedback_input').value;
    var userInfo = JSON.parse(localStorage.getItem("currentUser"));
    if(userInfo) {
        var send_data = {"type" : "feedback", "message" : message, "email" : userInfo.profileObj.email};
        axios.post(constants.routeUrl + "feedback", send_data).then(res => {
            console.log(res);
            console.log("FEEDBACK: Submitted", send_data)
        });
    }
    else {
        console.log('FEEDBACK: No user signed in!')
    }
}

export default Feedback;
