const fetchItems = (items) => {
    // console.log(items);
    return {
        type: "SET_ITEMS_IN_STORE",
        payload: items
    }
}

export default fetchItems;