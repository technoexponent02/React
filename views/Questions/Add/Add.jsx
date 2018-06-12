import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
// import { API } from '../../../physician_life_api/api';
import {
	Card,
	CardBody,
	Row,
	Col
} from 'reactstrap';
import { PanelHeader } from 'components';
import './Add.css';

// const url = '/api/v1/sourceQuestions';

class AddQuestion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// @todo
		};
	}


	componentDidMount() {
		// scroll top
		ReactDOM.findDOMNode(this).scrollIntoView();
	}

	isAuthenticated() {
		const token = localStorage.getItem('Token');
		return token && token.length > 10;
	}


	render() {

		return (
			<div className="questions">
				{!this.isAuthenticated() ? <Redirect to="/pages" /> : ''}
				<PanelHeader size="sm" />
				<div className="content">

					<Row className="justify-content-center">
						<Col lg={ 12 } md={ 12 } xs={ 12 }>
							<Card>
								<CardBody>
									<h1>Add Question</h1>
								</CardBody>
							</Card>
						</Col>
					</Row>

				</div>
			</div>
		);
	}
}

export default AddQuestion;
