const selectEvent = (event, id, city) => {
    // console.log(items);
    return {
        type: "EVENT_SELECTED",
        identifier: id,
        payload: event,
        city: city
    }
}

export default selectEvent;