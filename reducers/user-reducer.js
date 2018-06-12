import { UPDATE_USER } from '../actions/user-action';

/**
 * This is user reducer for passing
 * the new user as per type of the action
 */
export default function userReducer(state = '', {type, payload}){
	switch(type){
	case UPDATE_USER:
		return payload.user;
	default:
		return state;
	}
}

