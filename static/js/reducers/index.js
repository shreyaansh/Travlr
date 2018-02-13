import { combineReducers } from 'redux';
import reducerEntry from './reducer_entry'

const rootReducer = combineReducers({
	state: (state = {}) => state
});

export default rootReducer;