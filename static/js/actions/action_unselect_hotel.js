const unselectHotel = (hotel, id, city) => {
    // console.log(items);
    return {
        type: "HOTEL_UNSELECTED",
        identifier: id,
        payload: hotel,
        city: city
    }
}

export default unselectHotel;