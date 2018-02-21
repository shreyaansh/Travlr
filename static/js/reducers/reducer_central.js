const initialState = {
    renderer: "main_page"
}

function centralReducer(state = initialState, action) {
    switch (action.type) {
        case "PAGE_RENDER_CHANGE_LOGIN":
            return ({
                renderer: "login_page"
            });
        
        case "PAGE_RENDER_CHANGE_MAIN":
            return ({
                renderer: "main_page"
            });
        default:
            return state
    }
}

export default centralReducer;