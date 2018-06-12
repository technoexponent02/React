import Users from '../views/Users/Users';
import AddUser from '../views/Users/Add/Add';
import ImportedQuestions from '../views/Questions/ImportedQuestions/ImportedQuestions';
import AdminDashboard from '../views/AdminDashboard/AdminDashboard';
import Lectures from '../views/Lectures/Lectures';
import FlashCards from '../views/FlashCards/FlashCards';
import { AccessManagement } from '../views/AccessManagement/AccessManagement';
import SubmittedQuestions from '../views/Questions/SubmittedQuestions/SubmittedQuestions';
import SourceQuestions from '../views/Questions/SourceQuestions/SourceQuestions';
import Question from '../views/Questions/Question/Question';
import Clinical from '../views/Clinical/Clinical';
import AddClinical from '../views/Clinical/AddClinical';

/**
 * This will hold the
 * full dashboard section routing
 */
var dashRoutes = [];

/**
 * As per user role they will
 * able to navigate according routes.
 *
 * This routing will be render the only dashboard section
 */
if (AccessManagement() == 'contributor') {
	dashRoutes = [
		{
			path: '/dashboard',
			name: 'Dashboard',
			icon: 'design_app',
			component: AdminDashboard
		},
		{
			collapse: true,
			path: '/unverified-questions',
			name: 'Questions',
			state: 'openQuestions',
			icon: 'design-2_ruler-pencil',
			views: [
				{
					path: '/source-questions',
					name: 'Source Questions',
					mini: 'S',
					component: SourceQuestions
				},
				{
					path: '/imported-questions',
					name: 'Imported Questions',
					mini: 'I',
					component: ImportedQuestions
				},
				{
					path: '/submitted-questions',
					name: 'Submitted For Publication',
					mini: 'P',
					component: SubmittedQuestions
				}
			]
		},
		{ redirect: true, path: '/', pathTo: '/dashboard', name: 'Dashboard' }
	];
} else if (AccessManagement() == 'trainee') {
	dashRoutes = [
		{
			path: '/dashboard',
			name: 'Dashboard',
			icon: 'design_app',
			component: AdminDashboard
		},
		{
			collapse: true,
			path: '/all-questions',
			name: 'Questions',
			state: 'openQuestions',
			icon: 'design-2_ruler-pencil',
			views: [
				{
					path: '/attempt-question',
					name: 'Attempt Question',
					mini: 'A',
					component: Question
				}
			]
		},
		{
			path: '/lectures',
			name: 'Lecture',
			icon: 'media-1_album',
			component: Lectures
		},
		{
			path: '/FlashCards',
			name: 'Flash Cards',
			icon: 'files_single-copy-04',
			component: FlashCards
		},
		{ redirect: true, path: '/', pathTo: '/dashboard', name: 'Dashboard' }
	];
} else {
	dashRoutes = [
		{
			path: '/dashboard',
			name: 'Dashboard',
			icon: 'design_app',
			component: AdminDashboard
		},
		{
			collapse: true,
			path: '/users',
			name: 'Users',
			state: 'openUsers',
			icon: 'users_single-02',
			views: [
				{ path: '/users', name: 'All Users', mini: 'U', component: Users },
				{ path: '/add-user', name: 'Add User', mini: 'A', component: AddUser }
			]
		},
		{
			collapse: true,
			path: '/all-questions',
			name: 'Questions',
			state: 'openQuestions',
			icon: 'design-2_ruler-pencil',
			views: [
				{
					path: '/source-questions',
					name: 'Source Questions',
					mini: 'S',
					component: SourceQuestions
				},
				{
					path: '/imported-questions',
					name: 'Imported Questions',
					mini: 'V',
					component: ImportedQuestions
				},
				{
					path: '/submitted-questions',
					name: 'Submitted For Publication',
					mini: 'P',
					component: SubmittedQuestions
				}
			]
		},
		{
			collapse: true,
			path: '/clinical',
			name: 'Clinical',
			state: 'openClinical',
			icon: 'business_bank',
			views: [
				{
					path: '/clinical',
					name: 'Clinical Cases',
					mini: 'C',
					component: Clinical
				},
				{
					path: '/add-clinical',
					name: 'Add Clinical Case',
					mini: 'A',
					component: AddClinical
				}
			]
		},
		{
			path: '/lectures',
			name: 'Lecture',
			icon: 'media-1_album',
			component: Lectures
		},
		{
			path: '/FlashCards',
			name: 'Flash Cards',
			icon: 'files_single-copy-04',
			component: FlashCards
		},
		{ redirect: true, path: '/', pathTo: '/dashboard', name: 'Dashboard' }
	];
}

/**
 * This will check the dashboard
 * section fully loaded or not if
 * loaded then executing some ui
 * fine tuning work
 */
function fullLoad() {
	if (document.getElementsByClassName('sidebar-mini-deactivated').length > 0) {
		document
			.getElementsByClassName('sidebar-mini-deactivated')[0]
			.classList.remove('app-full-loading');
	}
}
window.onload = fullLoad;

export default dashRoutes;
