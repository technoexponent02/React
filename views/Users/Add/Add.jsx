// @flow
import React from 'react';
import { Redirect } from 'react-router-dom';

import { AccessManagement } from '../../AccessManagement/AccessManagement';

import { API } from '../../../physician_life_api/api';
import {
	EnableSidebar,
	DisableSidebar,
	sidebarTimeout
} from '../../../helpers/SidebarLoading';

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
import { PanelHeader } from 'components';
import { Button } from 'components';
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';

import './Add.css';
var selectOptions1 = [
	{ value: 1, label: 'Admin' },
	{ value: 2, label: 'Contributor' },
	{ value: 3, label: 'Trainee' }
];
//console.log(selectOptions1);
// var options1 = [];
//var selectOptions=[];

const url = '/api/v1/users';
const url1 = '/api/v1/trainingLocations';

/**
 * Add class component
 * @extends {React}
 */
class AddUser extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			type: {
				required: '',
				email: '',
				number: '',
				url: '',
				source: '',
				destination: '',
				requiredState: '',
				emailState: '',
				numberState: '',
				urlState: '',
				equalState: '',
				alert: null,
				show: false
			},
			user: {
				firstNameState: '',
				passwordState: '',
				loginNameState: '',
				lastNameState: '',
				locationState: '',
				rollState: '',

				firstName: '',
				password: '',
				lastName: '',
				login: '',
				training_location: '',
				rollId: ''
			},
			redirect: false,
			dropdownOpen: false,
			selectOptions: [],
			singleSelect: null,
			singleSelect1: null,
			trainingStatus: false,
			errorMessage: '',
			alert: null,
			isError: false
		};

		// Binding function calling
		this.hideAlert = this.hideAlert.bind(this);
		this.errAlert = this.errAlert.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.toggle = this.toggle.bind(this);
		this.getLocation = this.getLocation.bind(this);
		this.loginFullName = this.loginFullName.bind(this);
		this.loginLastName = this.loginLastName.bind(this);
		this.rollList1 = this.rollList1.bind(this);
		this.rollList = this.rollList.bind(this);
		this.loginName = this.loginName.bind(this);
		this.loginPassword = this.loginPassword.bind(this);
		this.typeValidate = this.typeValidate.bind(this);
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
	 * This will make toggle the dropdown
	 */
	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}


	/**
	 * This will check the first name value change
	 * and also check the validation issues
	 * @param {*} e this will get the on click event object
	 */
	loginFullName(e) {
		this.state.user.firstName = e.target.value;
		if (/[a-z]/.test(e.target.value) || /[A-Z]/.test(e.target.value)) {
			this.state.user.firstNameState = 'has-success';
		} else {
			this.state.user.firstNameState = 'has-danger';
		}
		this.setState(this.state);
	}

	/**
	 * This will check the last name value change
	 * and also check the validation issues
	 * @param {*} e this will get the on click event object
	 */
	loginLastName(e) {
		// var login = this.state.user;
		this.state.user.lastName = e.target.value;
		if (/[a-z]/.test(e.target.value) || /[A-Z]/.test(e.target.value)) {
			this.state.user.lastNameState = 'has-success';
		} else {
			this.state.user.lastNameState = 'has-danger';
		}
		this.setState(this.state);
	}

	/**
	 * This will check the login name value change
	 * and also check the validation issues
	 * @param {*} e this will get the on click event object
	 */
	loginName(e) {
		this.state.user.login = e.target.value;
		if (/[a-z]/.test(e.target.value) || /[A-Z]/.test(e.target.value)) {
			this.state.user.loginNameState = 'has-success';
		} else {
			this.state.user.loginNameState = 'has-danger';
		}
		this.setState(this.state);
	}

	/**
	 * This will check the login password value change
	 * and also check the validation issues
	 * @param {*} e this will get the on click event object
	 */
	loginPassword(e) {
		// var login = this.state.user;
		this.state.user.password = e.target.value;
		if (e.target.value.length > 0) {
			this.state.user.passwordState = 'has-success';
		} else {
			this.state.user.passwordState = 'has-danger';
		}
		this.setState(this.state);
	}


	/**
	 * This will show success alert message
	 */
	successAlert() {
		this.setState({
			alert: (
				<SweetAlert
					success
					style={ { display: 'block', marginTop: '-100px' } }
					title="Success!"
					onConfirm={ this.hideAlert }
					onCancel={ this.hideAlert }
					confirmBtnBsStyle="success"
				>
          Successfully added new user
				</SweetAlert>
			)
		});
	}


	/**
	 * This will show error alert message
	 */
	errAlert() {
		this.setState({
			alert: (
				<SweetAlert
					error
					style={ { display: 'block', marginTop: '-100px' } }
					title="Wrong!"
					onConfirm={ this.hideAlert }
					onCancel={ this.hideAlert }
					confirmBtnBsStyle="error"
				>
          Something went wrong
				</SweetAlert>
			)
		});
	}


	/**
	 * This will check the input validation
	 */
	typeValidate() {
		//var type = this.state.user;
		var status = true;
		if (this.state.user.firstNameState !== 'has-success') {
			this.state.user.firstNameState = 'has-danger';
			status = false;
		}

		if (this.state.user.lastNameState !== 'has-success') {
			this.state.user.lastNameState = 'has-danger';
			status = false;
		}
		if (this.state.user.loginNameState !== 'has-success') {
			this.state.user.loginNameState = 'has-danger';
			status = false;
		}

		if (this.state.user.passwordState !== 'has-success') {
			this.state.user.passwordState = 'has-danger';
			status = false;
		}
		if (this.state.user.locationState !== 'has-success') {
			this.state.user.locationState = 'has-danger';
			status = false;
		}
		if (this.state.user.rollState !== 'has-success') {
			this.state.user.rollState = 'has-danger';
			status = false;
		}

		if (status) {
			this.addUser();
		}

		this.setState(this.state);
	}

	/**
	 * This will add the new user
	 */
	addUser = async () => {
		//event.preventDefault();
		const {
			firstName,
			lastName,
			password,
			login,
			training_location,
			rollId
		} = this.state.user;

		const localObj = {
			firstName,
			lastName,
			password,
			login,
			training_location,
			rollId
		};

		await API.post(
			url,
			localObj
		)
			.catch(error => {
				// console.log(error.response.data);
				if (error.response.status == 400) {
					this.state.user.loginNameState = 'has-danger';
					this.setState(this.state);
					this.setState({ errorMessage: error.response.data.login[0] });

					var login = this.state.user;
					login['loginNameState'] = 'has-danger';
					this.setState({ login });
					this.setState({ errorMessage: error.response.data.login[0] });
				}
				this.setState({ isError: true });
			})
			.then(response => {
				if (response) {
					// console.log('GOOD', response);
					this.successAlert();
					this.setState({ isError: false });
					setTimeout(() => {
						this.setState({ redirect: true });
					}, 800);
				}
			});
	};


	/**
	 * This will get the training changed value
	 * @param {*} event get the select box on change event
	 */
	rollList(event) {
		// console.log(event);
		this.state = {
			...this.state,

			singleSelect: event.label
		};
		this.setState(this.state);

		//var format = this.state.user;
		this.state.user.locationState = 'has-success';
		this.state.user.training_location = event.id;

		this.setState(this.state);

		//this.setState({ user: { ...this.state.user, training_location: event.value} });
		// console.log(this.state);
	}


	/**
	 * This will get the roll changed value
	 * @param {*} event get the select box on change event
	 */
	rollList1(event) {
		// console.log(event.value);
		// var format = this.state.user;
		this.state.user.rollState = 'has-success';
		if (event.value == 3) {
			this.state = {
				...this.state,
				trainingStatus: true,
				singleSelect1: event.value
			};
			this.state.user.locationState = 'has-danger';
			this.setState(this.state);

			// console.log(this.state);
		} else {
			this.state = {
				...this.state,
				trainingStatus: false,
				singleSelect1: event.value
			};
			this.setState(this.state);
		}

		this.state.user.rollId = event.value;
		this.setState(this.state);
		// console.log(this.state);
	}


	/**
	 * This will get the hospital location
	 * from the database
	 */
	getLocation = async () => {
		//event.preventDefault();
		API.get(`${url1}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
				DisableSidebar();
			})
			.then(response => {
				if (response) {
					let arr = response.data.map(l => ({
						value: l.hospital,
						label: l.hospital,
						id: l.id
					}));
					// console.log(arr);
					// this.setState({ selectOptions: [...this.state.selectOptions, arr]});
					this.setState({ selectOptions: arr });
					setTimeout(() => {
						DisableSidebar();
					}, sidebarTimeout);
				}
			});
	};


	/**
	 * This is users page render function
	 */
	componentDidMount() {
		EnableSidebar();

		var type = this.state.user;
		type['locationState'] = 'has-success';
		type['rollState'] = 'has-danger';
		this.setState({ type });
		this.getLocation();
	}


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
			<div className="add-users">
				{this.state.redirect ? <Redirect to="/users" /> : ''}
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
					<Row className="justify-content-center">
						<Col lg={ 12 } md={ 12 } xs={ 12 }>
							<Card>
								<CardHeader>
									<h3 className="users-header">Add new user</h3>
								</CardHeader>

								{this.state.isError && (
									<Alert color="danger">
										<span>
											{this.state.isError ? this.state.errorMessage : ''}
										</span>
									</Alert>
								)}
								<Form className="form-horizontal">
									<CardBody>
										<Row>
											<Label sm={ 2 }>
												First Name <span className="reqField">*</span>
											</Label>
											<Col xs={ 12 } sm={ 7 }>
												<FormGroup className={ this.state.user.firstNameState }>
													<Input
														type="text"
														onChange={ this.loginFullName }
													/>
												</FormGroup>
											</Col>
										</Row>

										<Row>
											<Label sm={ 2 }>
												Last Name <span className="reqField">*</span>
											</Label>
											<Col xs={ 12 } sm={ 7 }>
												<FormGroup className={ this.state.user.lastNameState }>
													<Input
														type="text"
														onChange={ this.loginLastName }
													/>
												</FormGroup>
											</Col>
										</Row>

										<Row>
											<Label sm={ 2 }>
												Roles <span className="reqField">*</span>
											</Label>
											<Col xs={ 12 } sm={ 7 }>
												<FormGroup className={ this.state.user.rollState }>
													<Select
														deleteRemoves={ false }
														clearable={ false }
														searchable={ false }
														className="primary"
														placeholder="Single Select1"
														name="singleSelect1"
														value={ this.state.singleSelect1 }
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
													<FormGroup className={ this.state.user.locationState }>
														<Select
															deleteRemoves={ false }
															clearable={ false }
															className="primary"
															placeholder="Single Select"
															name="singleSelect"
															value={ this.state.singleSelect }
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
												Login Name <span className="reqField">*</span>
											</Label>
											<Col xs={ 12 } sm={ 7 }>
												<FormGroup className={ this.state.user.loginNameState }>
													<Input
														type="text"
														onChange={ this.loginName }
													/>
												</FormGroup>
											</Col>
										</Row>

										<Row>
											<Label sm={ 2 }>
												Password <span className="reqField">*</span>
											</Label>
											<Col xs={ 12 } sm={ 7 }>
												<FormGroup className={ this.state.user.passwordState }>
													<Input
														type="password"
														onChange={ this.loginPassword }
													/>
												</FormGroup>
											</Col>
										</Row>
									</CardBody>
									<CardFooter>
										<div className="row">
											<label className="col-sm-2 col-form-label hide-mobile-blank" />
											<div className="col-12 col-sm-7 text-left">
												<Button
													color="primary"
													onClick={ this.typeValidate }
												>
													Submit
												</Button>
											</div>
										</div>
									</CardFooter>
								</Form>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default AddUser;
