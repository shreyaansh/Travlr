const view_saved_itin = (data) => {

    return {
        type: "VIEW_SELECTED_SAVED_ITINERARY",
        payload: JSON.parse(data)
    }
}

export default view_saved_itin;