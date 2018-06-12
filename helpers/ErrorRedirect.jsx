
/**
 * This will store the error response
 * and user data for using other action
 * @param {number} status pass the XHR response error code
 */
export function ErrorRedirect(status) {
	if (status == 500) {
		const getData = {
			email: JSON.parse(localStorage.getItem('UserInfo')).email,
			date: new Date().toLocaleDateString('en-US'),
			time: new Date().toLocaleTimeString('en-US'),
			url: window.location.href
		};
		sessionStorage.setItem('ErrorReport', JSON.stringify(getData));
	}
}
