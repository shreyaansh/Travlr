import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from "axios";

class DpUserContent extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {

        return (
            <div className="collapsible-body">

            </div>
        );
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({});
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DpUserContent);
