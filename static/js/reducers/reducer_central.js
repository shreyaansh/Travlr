const initialState = {
    renderer: "main_page",
    hotels: {},
    events: {},
}

function centralReducer(state = initialState, action) {
    switch (action.type) {
        case "PAGE_RENDER_CHANGE_MAIN":
            return ({
                renderer: "main_page",
                hotels: state.hotels,
                events: state.events,

            });
        case "POST_USER_INFO":
            console.log("ACTION: USER INFO POSTED");
            return state;

        case "SET_ITEMS_IN_STORE":
            return ({
                renderer: "options_page",
                hotels: action.payload,
                events: state.events,
            });
        default:
            return state
    }
}

export default centralReducer;