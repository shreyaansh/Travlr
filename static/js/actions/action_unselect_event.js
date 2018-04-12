const unselectEvent = (event, id, city) => {
    // console.log(items);
    return {
        type: "EVENT_UNSELECTED",
        identifier: id,
        payload: event,
        city: city
    }
}

export default unselectEvent;