import axios from "axios";
import constants from "../../constants"

const postUserFeedback = (userFeedback) => {
    axios.post(constants.routeUrl + "feedback", {userFeedback}).then(res => {
        console.log(res);
    });
    return {
        type: "POST_USER_FEEDBACK",
        payload: userFeedback
    }
}

export default postUserFeedback();