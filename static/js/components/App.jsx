import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GoogleLogin } from 'react-google-login';

import goToLogin from '../actions/action_select_login'
import goToMain from '../actions/action_select_main'

const clientId = "";

class App extends React.Component {

	constructor (props) {
		super(props);
	}

	responseGoogle(response) {
		console.log(response);
	}

	render() {

		return (
			<div>
				
				<h2>🏨 Travlr ✈️</h2>

				<GoogleLogin
					clientId="110941707391-lin5grtvjtedoudnpe5p37tnbq7f3qkd.apps.googleusercontent.com"
					buttonText="Sign-in with Google"
					onSuccess={this.responseGoogle}
					onFailure={this.responseGoogle}
				/>
			
			</div>
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