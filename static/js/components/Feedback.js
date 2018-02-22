import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import postUserFeedback from '../actions/action_post_user_feedback';

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
                    <a onClick={this.postUserFeedback(getFeedbackData())} className="modal-action modal-close waves-effect waves-green btn-flat">Send</a>
                    <a href="#" className="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
        </div>
    );
}

function getFeedbackData() {
    var message = document.getElementById('feedback_input');
    var send_data = {"type" : "feedback", "message" : message};
    return send_data;
}

const mapStateToProps = ({ centralReducer }) => {
    return ({
        renderer: centralReducer.renderer
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({goToLogin, goToMain, postUserInfo}, dispatch);
}

export default Feedback;