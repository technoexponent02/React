/**
 * This is update user action type name
 */
export const UPDATE_USER = 'users:updateUser';
/**
 * This will make action for the new user
 * @param {Object} newUser new user passing for the payload
 */
export function updateUser(newUser) {
	return {
		type: UPDATE_USER,
		payload: {
			user: newUser
		}
	};
}