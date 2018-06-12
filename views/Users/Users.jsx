// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Link } from 'react-router-dom';
import { API } from '../../physician_life_api/api';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { AccessManagement } from '../AccessManagement/AccessManagement';

import { PanelHeader, Button } from 'components';

import './Users.css';

import { EnableSidebar, DisableSidebar, sidebarTimeout } from '../../helpers/SidebarLoading';

import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	Alert
} from 'reactstrap';

import $ from 'jquery';
// DataTables.net plugin - creates a tables with actions on it
$.DataTable = require('datatables.net-bs');
require('datatables.net');
require('datatables.net-responsive');


var selectOptions1 = [
	{ value: 1, label: 'Admin' },
	{ value: 2, label: 'Contributor' },
	{ value: 3, label: 'Trainee' }
];

var url = '/api/v1/users/';
const url1 = '/api/v1/trainingLocations';
const url2 = '/api/v1/filterUsers';
var reachOnInit = false;

/**
 * User class component
 * @extends {React}
 */
class Users extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			editUser: {},
			users: [],
			isEdit: false,
			alert: null,
			show: false,
			loadingState: true,
			validationState: {
				firstNameState: '',
				lastNameState: '',
				loginNameState: '',
				locationState: '',
				rollState: ''
			},
			selectOptions: [],
			trainingStatus: false,
			pages: '',
			nextPageUrl: '',
			perPageUrl: '',
			prevPageState: false,
			lastPageState: false,
			errorMessage: '',
			isError: false
		};

		// Binding function calling
		this.hideAlert = this.hideAlert.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.rollList = this.rollList.bind(this);
		this.rollList1 = this.rollList1.bind(this);
		this.users = this.users.bind(this);
		this.typeValidate = this.typeValidate.bind(this);
		this.cancel = this.cancel.bind(this);
		this.fetchData = this.fetchData.bind(this);
		this.confirmDeleteAlert = this.confirmDeleteAlert.bind(this);
		this.showEditUserView = this.showEditUserView.bind(this);
	}

	/**
	 * This will return the all users
	 * with paginated data
	 */
	users() {
		API.get(`${url}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
				DisableSidebar();
			})
			.then(response => {
				if (response) {
					url = '/api/v1/users/';

					this.setState({ pages: response.data.last_page });

					// console.log(response.data.data);
					this.setState({ users: response.data.data });

					if (response.data.last_page == response.data.current_page) {
						this.setState({ prevPageState: true });
					}
					if (response.data.current_page == 1) {
						this.setState({ prevPageState: false });
					}
					if (this.state.prevPageState) {
						this.setState({ nextPageUrl: response.data.prev_page_url });
					} else {
						this.setState({ nextPageUrl: response.data.next_page_url });
					}

					// make loading state false
					this.setState({ loadingState: false });

					setTimeout(() => {
						DisableSidebar();
					}, sidebarTimeout);

				}
			});
	}

	/**
	 * This will get the hospital location
	 * from the database
	 */
	getLocation = async () => {
		API.get(`${url1}`)
			.catch(error => {
				if(error){
					// make something
				}
				// console.log('BAD', error);
			})
			.then(response => {
				if (response) {
					let arr = response.data.map(l => ({
						value: l.id,
						label: l.hospital
					}));
					this.setState({ selectOptions: arr });
				}
			});
	};

	/**
	 * This will call when we do
	 * paginate in the react table
	 * @param {Object} state pass the react data table change object
	 */
	fetchData(state) {

		if (reachOnInit) {
			reachOnInit = false;
			this.users();
		} else if (state.filtered.length > 0) {
			// console.log(state.filtered);
			let obj = [];
			obj = state.filtered.map(l => ({
				[l.id]: l.value
			}));
			var newObj = Object.assign({}, ...obj);
			// console.log(newObj);
			this.search(newObj);
		} else {
			url = url + '?' + 'page=' + (state.page + 1) + '&limit=' + state.pageSize;
			this.users();
		}
	}

	/**
	 * This will get the filtered
	 * users as per searched values
	 * @param {Object} data user search query data
	 */
	search(data) {
		API.post(url2, data)
			.catch(error => {
				if(error){
					// make something
				}
			})
			.then(response => {
				url = '/api/v1/users/';

				this.setState({ pages: response.data.last_page });

				// console.log(response.data.data);
				this.setState({ users: response.data.data });

				if (response.data.last_page == response.data.current_page) {
					this.setState({ prevPageState: true });
				}
				if (response.data.current_page == 1) {
					this.setState({ prevPageState: false });
				}
				if (this.state.prevPageState) {
					this.setState({ nextPageUrl: response.data.prev_page_url });
				} else {
					this.setState({ nextPageUrl: response.data.next_page_url });
				}
			});
	}

	/**
	 * This will delete the user
	 * from the database as per ID
	 * @param {number} id pass the single user ID
	 */
	deleteUser(id) {
		this.setState({ loadingState: true });
		API.delete(`${url}${id}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
				this.setState({ loadingState: false });
			})
			.then(response => {
				if (response) {
					// go to top
				}
				this.setState({ loadingState: false });
				this.successAlertMessage('Deleted!', 'User Deleted Successfully.');
			});
		this.users();
		this.setState({
			alert: null
		});
	}

	/**
	 * This will get the roll changed value
	 * @param {*} event get the select box on change event
	 */
	rollList1(event) {
		this.state.validationState.rollState = 'has-success';
		if (event.value == 3) {
			this.state = {
				...this.state,
				trainingStatus: true
			};
			this.setState(this.state);
			this.state.validationState.locationState = 'has-danger';
			this.setState(this.state);
		} else {
			this.state.validationState.locationState = 'has-success';
			this.state = {
				...this.state,
				trainingStatus: false
			};

			this.setState(this.state);
		}

		this.state.editUser.rollId = event.value;
		if (this.state.editUser.role.length > 0) {
			this.state.editUser.role[0].id = event.value;
		} else {
			this.state.editUser.role.push({ id: event.value });
		}

		this.setState(this.state.editUser);
	}

	/**
	 * This will get the training changed value
	 * @param {*} event get the select box on change event
	 */
	rollList(event) {
		if (event.value) {
			this.state.validationState.locationState = 'has-success';
		} else {
			this.state.validationState.locationState = 'has-danger';
		}
		this.setState(this.state);
		this.state.editUser.training_location = event.value;
		if (this.state.editUser.training_locations.length > 0) {
			this.state.editUser.training_locations[0].id = event.value;
		} else {
			this.state.editUser.training_locations.push({ id: event.value });
		}

		this.setState(this.state.editUser);
	}

	/**
	 * This will update the single user
	 */
	updateUser = async () => {
		this.setState({ loadingState: true });
		API.put(`${url}${this.state.editUser.id}`, this.state.editUser)
			.catch(error => {
				// console.log(error.response);
				if (error.response.status == 400) {
					this.state.validationState.loginNameState = 'has-danger';
					this.setState(this.state);
					this.setState({ errorMessage: error.response.data.login[0] });
					this.setState({ isError: true });
				}
				this.setState({ loadingState: false });
			})
			.then(response => {
				// console.log(response);
				if (response) {
					this.successAlertMessage('Updated!', 'User Updated Successfully.');
					this.setState({ loadingState: false });
					this.setState({
						isEdit: false
					});
					this.users();
				}
			});
	};

	/**
	 * This will show the user edit section
	 * @param {*} e this will get the on click event object
	 */
	showEditUserView(e) {
		const item = JSON.parse(e.target.value);
		//   var update = this.state.validationState;
		this.state.isError = false;
		// console.log(this.state);
		this.state = {
			...this.state,
			editUser: item,
			isEdit: true
		};
		if (this.state.editUser.role.length > 0) {
			this.state.validationState.rollState = 'has-success';
			if (this.state.editUser.role[0].id != 3) {
				this.state.trainingStatus = false;
				this.state.validationState.locationState = 'has-success';
			}
		} else {
			this.state.validationState.rollState = 'has-danger';
		}

		// console.log(this.state.editUser);
		if (this.state.editUser.training_locations.length > 0) {
			this.state.trainingStatus = true;
			this.state.editUser.training_location = this.state.editUser.training_locations[0].id;
			this.state.editUser.rollId = this.state.editUser.role[0].id;
			this.state.validationState.locationState = 'has-success';
		} else {
			this.state.trainingStatus = false;
		}

		this.setState(this.state);

		if (item.firstName != '') {
			this.state.validationState.firstNameState = 'has-success';
		} else {
			this.state.validationState.firstNameState = 'has-danger';
		}
		if (item.lastName != '') {
			this.state.validationState.lastNameState = 'has-success';
		} else {
			this.state.validationState.lastNameState = 'has-danger';
		}
		if (
			item.login != '' ||
			this.state.validationState.loginNameState == 'has-danger'
		) {
			this.state.validationState.loginNameState = 'has-success';
		} else {
			this.state.validationState.loginNameState = 'has-danger';
		}

		this.setState(this.state);
		ReactDOM.findDOMNode(this).scrollIntoView();
	}

	/**
	 * This will close the edit user view
	 * and toggle the user list view
	 */
	cancel() {
		this.setState({ isEdit: false });
	}

	/**
	 * This will open the confirm delete modal
	 * @param {*} e this will get the on click event object
	 */
	confirmDeleteAlert(e) {
		const id = e.target.value;

		this.setState({
			alert: (
				<SweetAlert
					warning
					style={ { display: 'block', marginTop: '-100px' } }
					title="Are you sure?"
					onConfirm={ () => this.deleteUser(id) }
					onCancel={ this.hideAlert }
					confirmBtnBsStyle="info"
					cancelBtnBsStyle="danger"
					confirmBtnText="Yes, delete it!"
					cancelBtnText="Cancel"
					showCancel
				>
					You will not be able to recover this imaginary file!
				</SweetAlert>
			)
		});
	}

	/**
	 * This will show success alert message
	 * @param {string} title pass the success alert title
	 * @param {string} msg pass the success alert message
	 */
	successAlertMessage(title, msg) {
		this.setState({
			alert: (
				<SweetAlert
					success
					style={ { display: 'block', marginTop: '-100px' } }
					title={ title }
					onConfirm={ this.hideAlert }
					onCancel={ this.hideAlert }
					confirmBtnBsStyle="info"
				>
					{msg}
				</SweetAlert>
			)
		});
	}

	/**
	 * This will hide the alert box
	 */
	hideAlert() {
		this.setState({
			alert: null
		});
	}

	/**
	 * This will check user authentication
	 */
	isAuthenticated() {
		const token = localStorage.getItem('Token');
		return token && token.length > 10;
	}

	/**
	 * This will edit user value inputs value change
	 * @param {*} event this will get the on click event object
	 */
	handleChange = (event) => {
		//var update = this.state.validationState;
		if (event.target.id == 'firstName') {
			this.state.editUser.firstName = event.target.value;
			if (
				/[a-z]/.test(event.target.value) ||
				/[A-Z]/.test(event.target.value)
			) {
				this.state.validationState.firstNameState = 'has-success';
			} else {
				this.state.validationState.firstNameState = 'has-danger';
			}
		} else if (event.target.id == 'lastName') {
			this.state.editUser.lastName = event.target.value;
			if (
				/[a-z]/.test(event.target.value) ||
				/[A-Z]/.test(event.target.value)
			) {
				this.state.validationState.lastNameState = 'has-success';
			} else {
				this.state.validationState.lastNameState = 'has-danger';
			}
		} else if (event.target.id == 'username') {
			this.state.editUser.login = event.target.value;
			if (
				/[a-z]/.test(event.target.value) ||
				/[A-Z]/.test(event.target.value)
			) {
				this.state.validationState.loginNameState = 'has-success';
			} else {
				this.state.validationState.loginNameState = 'has-danger';
			}
		}
		this.setState(this.state);
		this.setState({
			alert: null
		});
	};

	/**
	 * This will check the input validation
	 */
	typeValidate() {
		//var type = this.state.validationState;
		// console.log(this.state.validationState);
		var status = true;
		if (this.state.validationState.firstNameState !== 'has-success') {
			this.state.validationState.firstNameState = 'has-danger';
			status = false;
		}

		if (this.state.validationState.lastNameState !== 'has-success') {
			this.state.validationState.lastNameState = 'has-danger';
			status = false;
		}
		if (this.state.validationState.loginNameState !== 'has-success') {
			this.state.validationState.loginNameState = 'has-danger';
			status = false;
		}
		if (this.state.validationState.locationState !== 'has-success') {
			this.state.validationState.locationState = 'has-danger';
			status = false;
		}
		if (this.state.validationState.rollState !== 'has-success') {
			this.state.validationState.rollState = 'has-danger';
			status = false;
		}

		if (status) {
			this.updateUser();
		}

		this.setState(this.state);
	}

	/**
	 * This is users page render function
	 */
	componentDidMount() {
		EnableSidebar();
		reachOnInit = true;
		this.getLocation();
		this.users();
	}

	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {
		return (
			<div>
				{!this.isAuthenticated() ? <Redirect to="/pages" /> : ''}
				{AccessManagement() == 'contributor' ||
				AccessManagement() == 'trainee' ? (
						<Redirect to="/" />
					) : (
						''
					)}
				{this.state.alert}

				<PanelHeader size="sm" />
				<div className="content">
					{this.state.loadingState == true && (
						<Row className="justify-content-center page-loader">
							<h5>
								<strong>
									<i className="fa fa-spinner fa-spin" />&nbsp;Loading...
								</strong>
							</h5>
						</Row>
					)}

					{this.state.isEdit == true ? (
						<Row className="justify-content-center">
							<Col lg={ 12 } md={ 12 } xs={ 12 }>
								<Card className="edit-user">
									<CardHeader>
										<h3 className="users-header">Edit User</h3>
									</CardHeader>
									<Form className="form-horizontal">
										{this.state.isError && (
											<Alert color="danger">
												<span>
													{this.state.isError ? this.state.errorMessage : ''}
												</span>
											</Alert>
										)}
										<CardBody>
											<Row>
												<Label sm={ 2 }>
													First Name <span className="reqField">*</span>
												</Label>
												<Col xs={ 12 } sm={ 7 }>
													<FormGroup
														className={ this.state.validationState.firstNameState }
													>
														<Input
															id="firstName"
															value={ this.state.editUser.firstName }
															type="text"
															onChange={ this.handleChange }
														/>
													</FormGroup>
												</Col>
											</Row>

											<Row>
												<Label sm={ 2 }>
													Last Name <span className="reqField">*</span>
												</Label>
												<Col xs={ 12 } sm={ 7 }>
													<FormGroup
														className={ this.state.validationState.lastNameState }
													>
														<Input
															id="lastName"
															value={ this.state.editUser.lastName }
															type="text"
															onChange={ this.handleChange }
														/>
													</FormGroup>
												</Col>
											</Row>
											<Row>
												<Label sm={ 2 }>
													Roles <span className="reqField">*</span>
												</Label>
												<Col xs={ 12 } sm={ 7 }>
													<FormGroup
														className={ this.state.validationState.rollState }
													>
														<Select
															className="primary"
															placeholder="Single Select1"
															name="singleSelect1"
															deleteRemoves={ false }
															clearable={ false }
															searchable={ false }
															value={
																this.state.editUser.role.length > 0
																	? this.state.editUser.role[0].id
																	: ''
															}
															options={ selectOptions1 }
															onChange={ this.rollList1 }
														/>
													</FormGroup>
												</Col>
											</Row>
											{this.state.trainingStatus ? (
												<Row>
													<Label sm={ 2 }>
														Training Location <span className="reqField">*</span>
													</Label>
													<Col xs={ 12 } sm={ 7 }>
														<FormGroup
															className={
																this.state.validationState.locationState
															}
														>
															<Select
																deleteRemoves={ false }
																clearable={ false }
																searchable={ false }
																className="primary"
																placeholder="Single Select"
																name="singleSelect"
																deleteRemoves={ false }
																value={
																	this.state.editUser.training_locations
																		.length > 0
																		? this.state.editUser.training_locations[0]
																			.id
																		: ''
																}
																options={ this.state.selectOptions }
																onChange={ this.rollList }
															/>
														</FormGroup>
													</Col>
												</Row>
											) : (
												''
											)}

											<Row>
												<Label sm={ 2 }>
													Username <span className="reqField">*</span>
												</Label>
												<Col xs={ 12 } sm={ 7 }>
													<FormGroup
														className={ this.state.validationState.loginNameState }
													>
														<Input
															id="username"
															value={ this.state.editUser.login }
															type="text"
															onChange={ this.handleChange }
														/>
													</FormGroup>
												</Col>
											</Row>

											<CardFooter>
												<div className="row">
													<label className="col-sm-2 col-form-label hide-mobile-blank"></label>
													<div className="col-12 col-sm-7 text-left">
														<Button
															color="primary"
															onClick={ this.typeValidate }
														>
															Update
														</Button>{' '}
														<Button color="primary" onClick={ this.cancel }>
															Cancel
														</Button>
													</div>
												</div>
											</CardFooter>
										</CardBody>
									</Form>
								</Card>
							</Col>
						</Row>
					) : (
						this.state.loadingState == false && (
							<Row>
								<Col xs={ 12 }>
									<Card>
										<CardHeader>
											<div className="row">
												<div className="col-6">
													<h3 className="users-header">All Users</h3>
												</div>
												<div className="col-6 text-right">
													<Link to={ '/add-user' }>
														<Button color="primary" round>
															Add User
														</Button>
													</Link>
												</div>
											</div>
										</CardHeader>
										<CardBody>
											<ReactTable
												manual
												filterable
												data={ this.state.users }
												pages={ this.state.pages }
												onFetchData={ this.fetchData }
												columns={ [
													{
														Header: 'Email',

														accessor: 'email'
													},
													{
														Header: 'First Name',

														accessor: 'firstName'
													},
													{
														Header: 'Last Name',

														accessor: 'lastName'
													},
													{
														id: 'hospital',
														Header: 'Hospital',

														accessor: d => {
															if (d.training_locations.length > 0)
																return d.training_locations[0].hospital;
														}

														// Custom value accessors!
													},
													{
														id: 'lastlogin',
														Header: 'Last Login',
														filterable: false,

														accessor: d => {
															if (d.user_login.length > 0)
																return d.user_login[0].created_at;
														}

														// Custom value accessors!
													},
													{
														Header: 'Actions',
														filterable: false,

														Cell: row => (
															<div className="text-right">
																<Button
																	icon
																	color="success now-ui-icons ui-2_settings-90"
																	size="sm"
																	value={ JSON.stringify(row.original) }
																	onClick={ this.showEditUserView }
																>
																</Button>{' '}
																<Button
																	icon
																	color="danger now-ui-icons ui-1_simple-remove"
																	size="sm"
																	value={ row.original.id }
																	onClick={ this.confirmDeleteAlert }
																>
																</Button>
															</div>
														)
													}
												] }
												defaultPageSize={ 10 }
												className="-striped -highlight"
											/>
										</CardBody>
									</Card>
								</Col>
							</Row>
						)
					)}
				</div>
			</div>
		);
	}
}

export default Users;
