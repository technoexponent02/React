import React from 'react';
import {Redirect} from 'react-router-dom';
import { API } from '../../physician_life_api/api';

import {AccessManagement} from '../AccessManagement/AccessManagement';
import {ErrorRedirect} from '../../helpers/ErrorRedirect';

import { EnableSidebar, DisableSidebar,sidebarTimeout } from '../../helpers/SidebarLoading';


import moment from 'moment';
import {
	Card,
	CardBody,
	CardImg,
} from 'reactstrap';
import { PanelHeader } from 'components';
import './Lectures.css';

const url = '/api/v1/lectures';


/**
 * Lectures class component
 * @extends {React}
 */
class Lectures extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state= {
			lectures: [],
			pageNumber: 1
		};
	}

	/**
	 * This will check user authentication
	 */
	isAuthenticated() {
		const token = localStorage.getItem('Token');
		return token && token.length > 10;
	}

	/**
	 * This will get the all lectures from the database
	 * @param {number} pageNumber this will get the page number for infinite scrolling
	 */
	fetchLectures = async pageNumber => {
		await API.get(`${url}?page=${pageNumber}`)
			.catch(error => {
				// console.log('BAD', error);
				DisableSidebar();
				// this.setState({isError: true});
				if (error.response) {
					ErrorRedirect(error.response.status);
				}
			})
			.then(response => {
				if (response) {
					// console.log(response.data.data);

					this.setState({lectures: response.data.data});

					setTimeout(() => {
						DisableSidebar();
					}, sidebarTimeout);

				}
			});
	};


	/**
	 * React lifeCycle hook when component ready
	 */
	componentDidMount() {
		EnableSidebar();

		const { pageNumber } = this.state;

		this.fetchLectures(pageNumber);
	}


	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {

		// lectures list
		const lectures = this.state.lectures.map((item, i) => (
			<div className="col-sm-4" key={ i }>
				<Card>
					<CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=No%20Image&w=318&h=180" alt="Card image cap" />
					<CardBody>
						<h5 className="lecTitle">{item.title}</h5>
						<span className="badge badge-info">Presenter</span> <span>{item.presenter}</span><br />

						<span className="badge badge-success">Specialty: {item.specialty}</span>

						<div className="date-area">
							{item.created_at != null ?
								<p><strong>Date: </strong> {moment(item.created_at).format('MMMM Do YYYY')}</p>
								:
								<p>No valid date present</p>
							}
							<p><strong>Duration: </strong>{item.duration}</p>
						</div>

					</CardBody>
				</Card>
			</div>
		));



		return (
			<div>

				{!this.isAuthenticated() ? <Redirect to="/pages"/> : '' }
				{AccessManagement() == 'contributor' ? <Redirect to="/"/> : ''}

				<PanelHeader size="sm" />
				<div className="content">
					<div className="row">
						{lectures}
					</div>
				</div>
			</div>
		);
	}
}

export default Lectures;