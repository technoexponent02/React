import LoginPage from 'views/Pages/LoginPage.jsx';
import RegisterPage from 'views/Pages/RegisterPage.jsx';
import ErrorPage from 'views/Pages/ErrorPage.jsx';

/**
 * This routing will be render the only full page view
 */
const pagesRoutes = [
	{
		path: '/pages/register-page',
		name: 'Register Page',
		short: 'Register',
		mini: 'RP',
		icon: 'tech_mobile',
		component: RegisterPage
	},
	{
		path: '/pages/login-page',
		name: 'Login Page',
		short: 'Login',
		mini: 'LP',
		icon: 'users_circle-08',
		component: LoginPage
	},
	{
		path: '/pages/error',
		name: 'Error Page',
		short: 'Error',
		mini: 'E',
		icon: 'ui-1_lock-circle-open',
		component: ErrorPage
	},
	{
		redirect: true,
		path: '/pages',
		pathTo: '/pages/login-page',
		name: 'Login Page'
	}
];

export default pagesRoutes;
