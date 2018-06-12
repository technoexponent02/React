import React from 'react';
import { Card, CardHeader, CardBody, Row, Col, Alert } from 'reactstrap';

import {
	PanelHeader,
	FormInputs,
	Button
} from 'components';
import SweetAlert from 'react-bootstrap-sweetalert';
import { API } from '../../physician_life_api/api';

import { EnableSidebar, DisableSidebar, sidebarTimeout } from '../../helpers/SidebarLoading';

// import userBackground from 'assets/img/bg5.jpg';
// import userAvatar from 'assets/img/mike.jpg';

var url = '/api/v1/users';


/**
 * profilePage class component
 * @extends {React}
 */
class profilePage extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			user: {
				firstNameState: '',
				loginNameState: '',
				lastNameState: '',
				firstName: '',
				lastName: '',
				login: '',
				email: ''
			},
			saveStatus: false,
			errorMessage: '',
			alert: null,
			isError: false,
			disabled: false
		};

		// Binding function calling
		this.hideAlert = this.hideAlert.bind(this);
		this.save = this.save.bind(this);
		this.edit = this.edit.bind(this);
	}

	/**
	 * This will return the logged in user data
	 */
	users() {
		API.get(
			`${url}` + '/' + JSON.parse(localStorage.getItem('UserInfo')).userID
		)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make things
				}
				DisableSidebar();
			})
			.then(response => {
				if (response) {
					// console.log(response);
					this.setState({
						disabled: true,
						saveStatus: false
					});
					this.setState({
						user: Object.assign({}, this.state.user, {
							firstName: response.data.firstName
						})
					});
					this.setState({
						user: Object.assign({}, this.state.user, {
							lastName: response.data.lastName
						})
					});
					this.setState({
						user: Object.assign({}, this.state.user, {
							login: response.data.login
						})
					});
					this.setState({
						user: Object.assign({}, this.state.user, {
							email: response.data.email
						})
					});
					if (this.state.user.firstName != null) {
						this.setState({
							user: Object.assign({}, this.state.user, {
								firstNameState: 'has-success'
							})
						});
					} else {
						this.setState({
							user: Object.assign({}, this.state.user, {
								firstNameState: 'has-danger'
							})
						});
					}

					if (this.state.user.lastName != null) {
						this.setState({
							user: Object.assign({}, this.state.user, {
								lastNameState: 'has-success'
							})
						});
					} else {
						this.setState({
							user: Object.assign({}, this.state.user, {
								lastNameState: 'has-danger'
							})
						});
					}

					if (this.state.user.login != null) {
						this.setState({
							user: Object.assign({}, this.state.user, {
								loginNameState: 'has-success'
							})
						});
					} else {
						this.setState({
							user: Object.assign({}, this.state.user, {
								loginNameState: 'has-danger'
							})
						});
					}

					// console.log(this.state);
					setTimeout(() => {
						DisableSidebar();
					}, sidebarTimeout);

				}
			});
	}

	/**
	 * This will active the edit state
	 */
	edit() {
		this.setState({
			disabled: false,
			saveStatus: true
		});
	}

	/**
	 * This will save the edited user data
	 */
	save() {
		this.typeValidate();
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
          Successfully updated user
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
		window.location.reload();
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
	 * This will check the form validation
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

		if (status) {
			this.updateUser();
		}

		this.setState(this.state);
	}

	/**
	 * This will update the user data
	 */
	updateUser() {
		const { firstName, lastName, login } = this.state.user;
		API.put(
			`${url}/${JSON.parse(localStorage.getItem('UserInfo')).userID}`,
			JSON.stringify({
				firstName,
				lastName,
				login
			})
		)
			.catch(error => {
				if (error.response.status == 400) {
					this.state.user.loginNameState = 'has-danger';
					this.setState(this.state);
					this.setState({ errorMessage: error.response.data.login[0] });
					this.setState({ isError: true });
				}
			})
			.then(response => {
				// console.log(response);
				if (response) {
					let obj = JSON.parse(localStorage.getItem('UserInfo'));
					obj.firstName = response.data.firstName;
					obj.lastName = response.data.lastName;
					localStorage.setItem('UserInfo', JSON.stringify(obj));

					this.successAlert();
				}
			});
	}

	/**
	 * React lifeCycle hook when component getting destroy
	 */
	componentWillUnmount() {
		document.getElementsByTagName('html')[0].classList.remove('nav-open');
	}

	/**
	 * This is users page render function
	 */
	componentDidMount() {
		EnableSidebar();
		this.users();
		// remove nav class for slide the sidebar
		document.getElementsByTagName('html')[0].classList.remove('nav-open')
	}

	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {
		return (
			<div className="user-profile">
				<PanelHeader size="sm" />
				<div className="content">
					<Row>
						<Col md={ 8 } xs={ 12 }>
							{this.state.isError && (
								<Alert color="danger">
									<span>
										{this.state.isError ? this.state.errorMessage : ''}
									</span>
								</Alert>
							)}
							<Card>
								<CardHeader>
									{this.state.alert}
									<div className="row">
										<div className="col ">
											<h5 className="title">Edit Profile</h5>
										</div>
										<div className="col text-right">
											{this.state.saveStatus ? (
												<Button
													color="primary text-right"
													onClick={ this.save }
												>
                          save
												</Button>
											) : (
												<Button
													color="primary  text-right"
													onClick={ this.edit }
												>
                          Edit
												</Button>
											)}
										</div>
									</div>
								</CardHeader>

								<CardBody>
									<form>
										<FormInputs
											ncols={ [
												'col-md-6 ' + ' ' + this.state.user.firstNameState,
												'col-md-6 ' + ' ' + this.state.user.lastNameState
											] }
											proprieties={ [
												{
													label: 'FirstName',
													inputProps: {
														type: 'text',
														disabled: this.state.disabled,
														value: this.state.user.firstName,
														onChange: e => this.loginFullName(e)
													}
												},
												{
													label: 'LastName',
													inputProps: {
														type: 'text',
														disabled: this.state.disabled,
														value: this.state.user.lastName,
														onChange: e => this.loginLastName(e)
													}
												}
											] }
										/>

										<FormInputs
											ncols={ [
												'col-md-12' + ' ' + this.state.user.loginNameState
											] }
											proprieties={ [
												{
													label: 'Login Name',
													inputProps: {
														type: 'text',
														disabled: this.state.disabled,
														value: this.state.user.login,
														onChange: e => this.loginName(e)
													}
												}
											] }
										/>
										{this.state.user.email != null ? (
											<FormInputs
												ncols={ ['col-md-6'] }
												proprieties={ [
													{
														label: 'Email',
														inputProps: {
															type: 'text',
															disabled: true,
															value: this.state.user.email
														}
													}
												] }
											/>
										) : (
											''
										)}
									</form>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default profilePage;
