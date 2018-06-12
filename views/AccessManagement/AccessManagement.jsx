/**
 * This will check the local storage data
 * for the getting the roles
 */
export function AccessManagement() {
	if(localStorage.getItem('UserInfo') != null){
		switch (JSON.parse(localStorage.getItem('UserInfo')).r_id) {
		case 2:
			return 'contributor';
		case 3:
			return 'trainee';
		case 1:
			return 'admin';
		}
	}
}

