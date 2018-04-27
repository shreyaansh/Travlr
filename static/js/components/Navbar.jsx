import React from 'react';
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
        html += '<head><style>';
        html += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css">';
        html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js"></script>';
        html += '</style></head>';
        html += "<body>";
        html += '<div style=\"width:200px;\">';
        html += itin.html();
        html += '</div>';
        html += "</body></html>";
        console.log(html);

        var doc = new jsPDF('l', 'mm', [297, 210]);
        doc.setLineWidth(100);
        doc.fromHTML(html);
        doc.save("YourItinerary.pdf");

/*        var doc = new jsPDF();
        var pl = this.props.currentSelection.itinerary;
        doc.setFontStyle("bold");
        doc.text("Your Itinerary:",10,10);
        var y = 20;
        var np = false;
        jQuery.each(pl, function(loc, locs){
            if(np){
                doc.addPage();
                y=10;
            }
            np = true;
            doc.setFontStyle("bold");
            doc.text(loc.toUpperCase(),10,y);
            doc.setFontStyle("normal");
            y+=10;
            doc.text("Hotel Information:",20,y);
            y+=10;
            var hn = locs.selectedHotel.name;
            doc.text(hn,30,y);
            y+=10;
            var ha = locs.selectedHotel.formatted_address;
            doc.text(ha,40,y);
            y+=10;
            var se = locs.selectedEvents;
            doc.text("Events you are interested in:",20,y);
            y+=10;
            jQuery.each(se,function(eid,einf){
                var et = einf.title;
                doc.text(et, 30, y);
                y+=10;
                var en = einf.venue_name;
                doc.text(en,40,y);
                y+=10
                var est = einf.start_time;
                doc.text(est,40,y);
                y+=10;
            });
        });
        doc.save("itin.pdf");*/
    }

    renderPdfDownloadButton() {
        // debugger;
        if(this.props.renderer == "itinerary_page" || this.props.renderer == "custom_itin_page") {
            return(
                <a href="#" onClick={this.createPDF}><i class="material-icons left">file_download</i>Itinerary as PDF</a>
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
