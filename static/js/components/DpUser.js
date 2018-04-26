import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";

class DpUser extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {

        return (
            <div className="collapsible-header"><i class="material-icons">person_pin</i></div>
        );
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({});
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DpUser);
