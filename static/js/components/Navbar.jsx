import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';

import viewItin from '../actions/action_my_itineraries';

class Navbar extends React.Component {
    
    constructor (props) {
        super(props);
        console.log(this.props.navProps.nameHandler);
        this.renderPdfDownloadButton = this.renderPdfDownloadButton.bind(this);
        this.createPDF = this.createPDF.bind(this);
    }

    componentDidMount() {
        var buttons = Array.from($("li button"));
        buttons.forEach(function (elem) {
           elem.style.width = 'auto';
           elem.style.margin = '10px';
        });
    }

    createPDF() {

        // Load DOC
        var itin = $("#itinerary");
        var html = "<!DOCTYPE HTML>";
        html += '<html lang="en-us">';
        html += '<head><style></style></head>';
        html += "<body>";
        html += itin.html();
        html += "</body></html>";

        var doc = new jsPDF('l', 'mm', [297, 210]);
        doc.fromHTML(html);

        var pdf = doc.output();

        axios.post("http://localhost:5000/upload-itin", {pdf}).then(res => {
            console.log(res);
            if(confirm("Do you want to share you Itinerary on Facebook?")) {
                window.open("https://www.facebook.com/sharer.php?u=" + res.data.link);
            }

        });

        doc.save("YourItinerary.pdf");
    }

    renderPdfDownloadButton() {
        // debugger;
        if(this.props.renderer == "itinerary_page" || this.props.renderer == "custom_itin_page") {
            return(
                <a href="#" onClick={this.createPDF}><i className="material-icons left">file_download</i>Itinerary as PDF</a>
            );
        }
        else {
            return(
                <div></div>
            );
        }
    }

    render() {
        return (
            <div>
                <div className="navbar-fixed">
                    <nav className="black">
                        <div className="nav-wrapper">
                            <a href="#" className="brand-logo"><img id="nav_logo" src="/assets/travlr_logo_white.png"/></a>
                            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i
                                className="material-icons">menu</i></a>
                            <ul className="right hide-on-med-and-down">
                                <li><a href="#"><i className="material-icons left">settings</i></a></li>
                                <li><a href="#" onClick={this.props.viewItin}>My Itineraries</a></li>
                                <li>{this.renderPdfDownloadButton()}</li>
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
                </div>
                <div>
                    <ul className="sidenav" id="mobile-demo">
                        <li><a href="#"><i className="material-icons left">settings</i>Settings</a></li>
                        <li>{this.renderPdfDownloadButton()}</li>
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
            </div>
        );
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({
        renderer: centralReducer.renderer
    });
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({viewItin}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
