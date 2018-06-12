import Pages from 'layouts/Pages/Pages.jsx';
import Dashboard from 'layouts/Dashboard/Dashboard.jsx';
import UserLayout from 'layouts/UserLayout/UserProfilePage.jsx';

/**
 * Routing entry point for the whole application
 */
var indexRoutes = [
	{ path: '/user', name: 'profile', component: UserLayout },
	{ path: '/pages', name: 'Pages', component: Pages },
	{ path: '/', name: 'Home', component: Dashboard }
];

export default indexRoutes;
