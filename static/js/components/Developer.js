import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import selectDev from '../actions/action_select_dev';

class Developer extends React.Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div>
                <a className='waves-effect waves-light btn' onClick={this.props.selectDev} id="developer_btn"><i className="material-icons left">developer_mode</i>Developer Settings</a>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({selectDev}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Developer);
