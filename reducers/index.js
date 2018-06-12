import { combineReducers } from 'redux';
import userReducer from './user-reducer';

/**
 * this will combine the all
 * redux reducer and export those in one container
 */
const allReducer = combineReducers({
	user: userReducer
});

export default allReducer;
