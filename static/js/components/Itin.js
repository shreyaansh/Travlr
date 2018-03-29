import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Itin extends React.Component {
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

export default connect(mapStateToProps, mapDispatchToProps)(Itin);