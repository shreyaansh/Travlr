import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import constants from "../../../constants/constants"
import fetchItems from "../actions/action_fetch_items"
import selectHotel from "../actions/action_select_hotel"

class Hotel extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            card_class : "card white col s12 m12",
            text_class: "card-content black-text"
        }
        this.onHotelSelected = this.onHotelSelected.bind(this);
        this.onHotelUnselected = this.onHotelUnselected.bind(this);        
    }

    onHotelSelected() {
    
        // this.props.action(this.props.id);
        this.props.selectHotel(this.props.hotel_data, this.props.id, this.props.city);
        this.setState({card_class : "card teal col s12 m12"});
        this.setState({text_class: "card-content white-text"});        

    }

    onHotelUnselected() {
        this.setState({card_class : "card white col s12 m12"});
        this.setState({text_class: "card-content black-text"});                
    }

    render() {
        return (
            <div className="row">
                <div className={this.state.card_class} id="hotel_card">
                    <div className={this.state.text_class}>
                        <span className="card-title" id="hotel_name">{this.props.hotel_data['name']}</span>
                        <p id="hotel_address">{this.props.hotel_data['formatted_address']}</p>
                        <p id="hotel_website"><b>Website: </b>{this.props.hotel_data['website']}</p>
                        <p id="hotel_phone"><b>Phone: </b>{this.props.hotel_data['formatted_phone_number']}</p>
                        <p id="hotel_rating"><b>Rating: </b>{this.props.hotel_data['rating']}</p>
                    </div>
                    <div className="card-action">
                        <a className="btn green" onClick={this.onHotelSelected}>Select this Hotel</a>&nbsp;&nbsp;
                        <a className="btn red" onClick={this.onHotelUnselected}>Unselect Hotel</a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ centralReducer }) => {
    return ({
        currentSelection: centralReducer.currentSelection
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({selectHotel}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Hotel);
