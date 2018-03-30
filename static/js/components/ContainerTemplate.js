import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class NAME extends React.Component {
    constructor (props) {
        super(props);
    }
}

const mapStateToProps = (state) => {
    return {
        
    }
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NAME);