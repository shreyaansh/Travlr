const initialState = {
    renderer: "main_page",
    items: {},
}

function centralReducer(state = initialState, action) {
    switch (action.type) {
        case "PAGE_RENDER_CHANGE_MAIN":
            return ({
                renderer: "main_page",
                items: state.items,

            });
        case "POST_USER_INFO":
            console.log("ACTION: USER INFO POSTED");
            return state;

        case "SET_ITEMS_IN_STORE":
            return ({
                renderer: "options_page",
                items: action.payload,
            });
        default:
            return state
    }
}

export default centralReducer;