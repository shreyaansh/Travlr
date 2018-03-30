const selectHotel = (hotel, id, city) => {
    // console.log(items);
    return {
        type: "HOTEL_SELECTED",
        identifier: id,
        payload: hotel,
        city: city
    }
}

export default selectHotel;