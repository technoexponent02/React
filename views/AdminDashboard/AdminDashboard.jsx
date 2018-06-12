import React from 'react';
import { Redirect } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { PanelHeader } from 'components';

/**
 * AdminDashboard class component
 * @extends {React}
 */
class AdminDashboard extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {};
	}

	/**
	 * This will check user authentication
	 */
	isAuthenticated() {
		const token = localStorage.getItem('Token');
		return token && token.length > 10;
	}


	/**
	 * React lifeCycle hook when component ready
	 */
	componentDidMount() {}


	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {
		return (
			<div>
				{!this.isAuthenticated() ? <Redirect to="/pages" /> : ''}

				<PanelHeader size="sm" />
				<div className="content">
					<div className="row">
						<Card>
							<CardBody>
								<h5>Physician Life</h5>
							</CardBody>
						</Card>
					</div>
				</div>
			</div>
		);
	}
}

export default AdminDashboard;
