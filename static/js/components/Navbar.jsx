import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';

class Navbar extends React.Component {
    
    constructor (props) {
        super(props);
        console.log(this.props.navProps.nameHandler);
    }

    render() {
        return(
            <div className="navbar-fixed">
                <nav className="black">
                <div className="nav-wrapper">
                <a href="#!" className="brand-logo"><img src="/assets/travlr_logo_cropped_small.png" /></a>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                    <li><a href="#">Sass</a></li>
                    <li><a href="#">Components</a></li>
                    <li>
                    {!this.props.navProps.nameHandler
                        
                        ?
                            <GoogleLogin
                                clientId="110941707391-lin5grtvjtedoudnpe5p37tnbq7f3qkd.apps.googleusercontent.com"
                                buttonText="Sign-in with Google"
                                onSuccess={this.props.navProps.login}
                                onFailure={this.props.navProps.login}
                            />
                        : 
                            <GoogleLogout
                                buttonText={"Logout of " + this.props.navProps.nameHandler}
                                onLogoutSuccess={this.props.navProps.logout}
                            />
                    }
                    </li>
                </ul>
                </div>
            </nav>
            
            <ul className="sidenav" id="mobile-demo">
                <li><a href="#">Sass</a></li>
                <li><a href="#">Components</a></li>
                <li>
                    {!this.props.navProps.nameHandler

                        ?
                        <GoogleLogin
                            clientId="110941707391-lin5grtvjtedoudnpe5p37tnbq7f3qkd.apps.googleusercontent.com"
                            buttonText="Sign-in with Google"
                            onSuccess={this.props.navProps.login}
                            onFailure={this.props.navProps.login}
                        />
                        :
                        <GoogleLogout
                            buttonText={"Logout of " + this.props.navProps.nameHandler}
                            onLogoutSuccess={this.props.navProps.logout}
                        />
                    }
                </li>
            </ul>
          </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        
    }
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
