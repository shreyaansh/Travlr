import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import goToLogin from '../actions/action_select_login'
import goToMain from '../actions/action_select_main'

class App extends React.Component {
	render() {
		return (
			<div><h1>🏨 Travlr ✈️</h1></div>
		);
	}

	renderSelector() {
		if (this.props.renderer == 'PAGE_RENDER_CHANGE_LOGIN') {
			return (
				<DummyLogin />
			);
		}
		else if (this.props.renderer == 'PAGE_RENDER_CHANGE_MAIN') {
			return (
				<DummyMain />
			);
		}
	}
}


const mapStateToProps = ({ centralReducer }) => {
	return ({
		renderer: centralReducer.renderer
	});
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({goToLogin, goToMain}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);