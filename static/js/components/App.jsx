import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';

import goToLogin from '../actions/action_select_login'
import goToMain from '../actions/action_select_main'

const clientId = "";

class App extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
			currentUser: JSON.parse(localStorage.getItem('currentUser')) || null
		};
		
		this.googleLogin = this.googleLogin.bind(this);
		this.googleLogout = this.googleLogout.bind(this);
		this.nameHandler = this.nameHandler.bind(this);

	}

	googleLogin(response) {
		console.log("logged in");
		console.log(response);
		if(response) {
			localStorage.setItem('currentUser', JSON.stringify(response));
			this.setState({currentUser: JSON.parse(localStorage.getItem('currentUser'))});
		}
		else {
			console.log("Error: googleLogin@App.jsx");
		}
	}

	googleLogout(){
		localStorage.clear();
		this.setState({currentUser: ""});
	}


	nameHandler() {
		if( this.state.currentUser && this.state.currentUser.w3) {
			return this.state.currentUser.w3.ig;
		}
		else return ""
	}

	render() {

		return (
			<div>
				
				<h2>🏨 Travlr ✈️</h2>

				<hr />
				<h5> Logged in as {this.nameHandler()}.</h5>
				<GoogleLogin
					clientId="110941707391-lin5grtvjtedoudnpe5p37tnbq7f3qkd.apps.googleusercontent.com"
					buttonText="Sign-in with Google"
					onSuccess={this.googleLogin}
					onFailure={this.googleLogin}
				/>

				<GoogleLogout
					buttonText="Logout"
					onLogoutSuccess={this.googleLogout}
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