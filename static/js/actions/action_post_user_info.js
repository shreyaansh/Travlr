import axios from "axios";
import constants from "../../../constants/constants"

const postUserInfo = (userInfo) => {
    axios.post(constants.routeUrl + "authenticate", {userInfo}).then(res => {
						console.log(res);
    });
    return {
        type: "POST_USER_INFO",
        payload: userInfo
    }
}

export default postUserInfo;
