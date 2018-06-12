import React from 'react';
import { Redirect } from 'react-router-dom';
import { AccessManagement } from '../AccessManagement/AccessManagement';
import { Card, CardBody } from 'reactstrap';
import { PanelHeader } from 'components';


/**
 * FlashCards class component
 * @extends {React}
 */
class FlashCards extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	/**
	 * React lifeCycle hook when component ready
	 */
	componentDidMount() {}


	/**
	 * This will check user authentication
	 */
	isAuthenticated() {
		const token = localStorage.getItem('Token');
		return token && token.length > 10;
	}


	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {
		return (
			<div className="flashcards">
				{!this.isAuthenticated() ? <Redirect to="/pages" /> : ''}
				{AccessManagement() == 'contributor' ? <Redirect to="/" /> : ''}
				<PanelHeader size="sm" />
				<div className="content">
					<Card>
						<CardBody>
							<h1>Flash Cards</h1>
						</CardBody>
					</Card>
				</div>
			</div>
		);
	}
}

export default FlashCards;
