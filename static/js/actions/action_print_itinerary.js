import axios from "axios";
import constants from "../../../constants/constants"

const printItinerary = (data) => {
    axios.post(constants.routeUrl + "save-itin", {data}).then(res => {
        console.log("Saved Itinerary in DB");
        // console.log("hh: ", res);
    });

    return {
        type: "GENERATE_ITINERARY_FROM_DATA",
    }
}

export default printItinerary;