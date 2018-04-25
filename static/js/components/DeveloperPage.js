import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Mainpage from './Mainpage';
import Navbar from './Navbar';
import Footer from './Footer';
import Options from './Options';

import goToLogin from '../actions/action_select_login';
import goToMain from '../actions/action_select_main';
import postUserInfo from '../actions/action_post_user_info';
import constants from '../../../constants/constants';
import Feedback from "./Feedback";

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
		this.navProps = this.navProps.bind(this);		
		

	}

	googleLogin(response) {
		if(response) {
			localStorage.setItem('currentUser', JSON.stringify(response));
			this.setState({currentUser: JSON.parse(localStorage.getItem('currentUser'))});
			this.props.postUserInfo(response.getAuthResponse().id_token);
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
		else return null;
	}

	navProps() {
		return ({
			userInfo: this.state.currentUser,
			login: this.googleLogin,
			logout: this.googleLogout,
			nameHandler: this.nameHandler()
		});
	}

	render() {
		return (
			<div>
				<Navbar navProps={this.navProps()}/>
				{/*<Mainpage nameProp={this.nameHandler()} />*/}
				{this.renderSelector()}
				<Footer />
				<Feedback />
			</div>
		);
	}

	renderSelector() {
        <DeveloperPage />
	}
}


const mapStateToProps = ({ centralReducer }) => {
	return ({
		renderer: centralReducer.renderer
	});
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({goToLogin, goToMain, postUserInfo}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
