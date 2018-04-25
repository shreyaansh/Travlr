import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";
import constants from "../../../constants/constants";

class DeveloperPage extends React.Component {

    constructor (props) {
        super(props);
        this.getFeedback = this.getFeedback.bind(this);
    }

    componentDidMount() {
        this.getFeedback();
    }

    getFeedback() {
        axios.get(constants.routeUrl + 'get-feedback').then(res => {
            console.log("DATA RECEIVED:" + res);
            createFeedback(res.data);
        });
    }

    render() {

        return (
            <div className="row" id="feedback_div">
            </div>
        );
    }
}

function createFeedback(feedback) {
    console.log(feedback);
    var feedback_div = document.getElementById('feedback_div');

    for(var key in feedback){
        console.log(key);
        var userTableDiv = document.createElement("div");
        userTableDiv.id = "userTableDiv";

        var userTable = document.createElement("TABLE");
        userTable.className = "striped";
        userTable.id = "feedback_table";
        var userCaption = userTable.createCaption();
        userCaption.innerHTML = "<b>" + key + "</b>";

        for(var feed in feedback[key]){
            var userDataRow = userTable.insertRow(-1);
            userDataRow.id = feed;  // Set unique id as row id for deleting feedback
            var userDataIdCell = userDataRow.insertCell(0);
            userDataIdCell.innerHTML = "<b>" + feed + "</b>";
            var userDataCell = userDataRow.insertCell(1);
            userDataCell.innerHTML = feedback[key][feed];
            var userDeleteCell = userDataRow.insertCell(2);
            userDeleteCell.innerHTML = "<a class=\"btn red\" id=\"delete_feedback\" onclick=\"OnDeleteFeedback(this)\">Delete</a>";
        }

        userTableDiv.appendChild(userTable);
        feedback_div.appendChild(userTableDiv);
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({});
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperPage);
