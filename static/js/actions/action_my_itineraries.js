import axios from "axios";
import constants from "../../../constants/constants"

const viewItin = () => {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    var res_payload = {};
    var profile = user.profileObj;
    console.log('SAVED ITIN email: ' + profile.email);

    // axios.post(constants.routeUrl + "get-itin", {"email" : profile.email}).then(res => {
    //     console.log(res);
    //     res_payload = res.data[profile.email];
    // });

    var sdata = JSON.stringify({"email" : profile.email});
    var settings = {
        "async": false,
        "crossDomain": true,
        "url": constants.routeUrl + "get-itin",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "data": sdata
    }

    jQuery.ajax(settings).done(function (response) {
        console.log(response);
        res_payload = response[profile.email];
    });

    return {
        type: "VIEW_SAVED_ITINERARY",
        payload: res_payload || {}
    }
}

export default viewItin;