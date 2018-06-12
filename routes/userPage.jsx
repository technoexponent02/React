import profilePage from '../views/Users/profilePage';


/**
 * This routing will be render the only dashboard section.
 * mainly used for the left side top user related link
 */
var userPage = [
	{
		collapse: true,
		path: '/user/userProfile',
		name: 'User Profile',
		state: 'userProfile',
		icon: 'design-2_ruler-pencil',
		views: [
			{
				path: '/user/userProfile',
				name: 'userProfile',
				mini: 'up',
				component: profilePage
			}
		]
	},
	{ redirect: true, path: '/', pathTo: '/dashboard', name: 'Dashboard' }
];
export default userPage;
