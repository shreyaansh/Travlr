import { combineReducers } from 'redux';
import centralReducer from './reducer_central'

const rootReducer = combineReducers({
	centralReducer
});

export default rootReducer;