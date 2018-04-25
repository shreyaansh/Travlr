const initialState = {
    preloader: "done",
    renderer: "main_page",
    items: {},
    currentSelection: {
        itinerary: {},
        email: ""
    }
}

function centralReducer(state = initialState, action) {
    switch (action.type) {

        case "PRELOADER_STATE":

            return ({
                preloader: "loading",
                renderer: state.renderer,
                items: state.items,
                currentSelection: state.currentSelection
            });

        case "PAGE_RENDER_CHANGE_MAIN":
            return ({
                preloader: "done",
                renderer: "main_page",
                items: state.items,
                currentSelection: state.currentSelection

            });
        case "POST_USER_INFO":
            console.log("ACTION: USER INFO POSTED");
            state.preloader = "done";
            return state;

        case "SET_ITEMS_IN_STORE":
            return ({
                preloader: "done",
                renderer: "options_page",
                items: action.payload,
                currentSelection: state.currentSelection
            });

        case "GENERATE_ITINERARY_FROM_DATA":
            var new_itin = state.currentSelection;
            var userInfo = JSON.parse(localStorage.getItem("currentUser"));
            new_itin['email'] = userInfo.profileObj.email;
            console.log(new_itin);
            return ({
                preloader: "done",
               renderer: "itinerary_page",
               items: state.items,
               currentSelection: state.currentSelection
            });

        case "HOTEL_SELECTED":
            if(!(action.city in state.currentSelection.itinerary)) {
                state.currentSelection.itinerary[action.city] = {}
                state.currentSelection.itinerary[action.city].selectedHotel = {};
            } else if(!(state.currentSelection.itinerary[action.city].selectedHotel)){
                state.currentSelection.itinerary[action.city].selectedHotel = {}
            }
            state.currentSelection.itinerary[action.city].selectedHotel = action.payload;
            console.log(state.currentSelection.itinerary);
            state.preloader = "done";
            return state;
        
        case "EVENT_SELECTED":
            if(!(action.city in state.currentSelection.itinerary)) {
                state.currentSelection.itinerary[action.city] = {}
                state.currentSelection.itinerary[action.city].selectedEvents = {}
            } else if(!(state.currentSelection.itinerary[action.city].selectedEvents)){
                state.currentSelection.itinerary[action.city].selectedEvents = {}
            }
            state.currentSelection.itinerary[action.city].selectedEvents[action.identifier] = action.payload;
            console.log(state.currentSelection.itinerary);
            state.preloader = "done";
            return state;

        case "EVENT_UNSELECTED":
            if(!(action.city in state.currentSelection.itinerary)) {
                state.currentSelection.itinerary[action.city] = {}
                state.currentSelection.itinerary[action.city].selectedEvents = {}
            } else if(!(state.currentSelection.itinerary[action.city].selectedEvents)){
                state.currentSelection.itinerary[action.city].selectedEvents = {}
            }
            delete state.currentSelection.itinerary[action.city].selectedEvents[action.identifier];
            console.log(state.currentSelection.itinerary);
            state.preloader = "done";
            return state;                

        default:
            return state;
    }
}

export default centralReducer;