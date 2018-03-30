const initialState = {
    renderer: "main_page",
    items: {},
    currentSelection: {}
}

function centralReducer(state = initialState, action) {
    switch (action.type) {

        case "PAGE_RENDER_CHANGE_MAIN":
            return ({
                renderer: "main_page",
                items: state.items,
                currentSelection: state.currentSelection

            });
        case "POST_USER_INFO":
            console.log("ACTION: USER INFO POSTED");
            return state;

        case "SET_ITEMS_IN_STORE":
            return ({
                renderer: "options_page",
                items: action.payload,
                currentSelection: state.currentSelection
            });
        case "HOTEL_SELECTED":
            if(!(action.city in state.currentSelection)) {
                state.currentSelection[action.city] = {}
                state.currentSelection[action.city].selectedHotel = {};
            } else if(!(state.currentSelection[action.city].selectedHotel)){
                state.currentSelection[action.city].selectedHotel = {}
            }
            state.currentSelection[action.city].selectedHotel = action.payload;
            console.log(state.currentSelection);
            return state;
        
        case "EVENT_SELECTED":
            if(!(action.city in state.currentSelection)) {
                state.currentSelection[action.city] = {}
                state.currentSelection[action.city].selectedEvents = {}
            } else if(!(state.currentSelection[action.city].selectedEvents)){
                state.currentSelection[action.city].selectedEvents = {}
            }
            state.currentSelection[action.city].selectedEvents[action.identifier] = action.payload;
            console.log(state.currentSelection);
            return state;

        case "EVENT_UNSELECTED":
            if(!(action.city in state.currentSelection)) {
                state.currentSelection[action.city] = {}
                state.currentSelection[action.city].selectedEvents = {}
            } else if(!(state.currentSelection[action.city].selectedEvents)){
                state.currentSelection[action.city].selectedEvents = {}
            }
            delete state.currentSelection[action.city].selectedEvents[action.identifier];
            console.log(state.currentSelection);
            return state;                

        default:
            return state;
    }
}

export default centralReducer;