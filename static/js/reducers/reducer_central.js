const initialState = {
    renderer: "main_page",
    items: {},
    currentSelection: {
        itinerary: {},
        email: ""
    },
    savedItinerary : {},
    currentSavedSelection: {}
}

function centralReducer(state = initialState, action) {
    switch (action.type) {

        case "PAGE_RENDER_CHANGE_MAIN":
            return ({
                renderer: "main_page",
                items: state.items,
                currentSelection: state.currentSelection,
                savedItinerary : state.savedItinerary,
                currentSavedSelection: state.currentSavedSelection

            });
        case "PAGE_RENDER_CHANGE_DEV":
            return ({
                renderer: "dev_page",
                items: state.items,
                currentSelection: state.currentSelection,
                savedItinerary : state.savedItinerary,
                currentSavedSelection: state.currentSavedSelection

            });
        case "VIEW_SAVED_ITINERARY":
            console.log(action.payload);
            return ({
                renderer: "saved_itin_page",
                items: state.items,
                currentSelection: state.currentSelection,
                savedItinerary : action.payload,
                currentSavedSelection: state.currentSavedSelection

            });
        case "VIEW_SELECTED_SAVED_ITINERARY":
            return ({
                renderer: "custom_itin_page",
                items: state.items,
                currentSelection: state.currentSelection,
                savedItinerary : state.savedItinerary,
                currentSavedSelection: action.payload

            });
        case "POST_USER_INFO":
            console.log("ACTION: USER INFO POSTED");
            return state;

        case "SET_ITEMS_IN_STORE":
            return ({
                renderer: "options_page",
                items: action.payload,
                currentSelection: state.currentSelection,
                savedItinerary : state.savedItinerary,
                currentSavedSelection: state.currentSavedSelection
            });

        case "GENERATE_ITINERARY_FROM_DATA":
            var new_itin = state.currentSelection;
            var userInfo = JSON.parse(localStorage.getItem("currentUser"));
            new_itin['email'] = userInfo.profileObj.email;
            console.log(new_itin);
            return ({
               renderer: "itinerary_page",
               items: state.items,
               currentSelection: state.currentSelection,
                savedItinerary : state.savedItinerary,
                currentSavedSelection: state.currentSavedSelection
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
            return state;                

        default:
            return state;
    }
}

export default centralReducer;