import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUser } from '../../actions/user-action';

import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import {
	Container,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Col,
	Alert
} from 'reactstrap';
import { Button } from 'components';
/*import nowLogo from 'assets/img/now-logo.png';*/
import bgImage from 'assets/img/bg14.jpg';
import { API } from '../../physician_life_api/api';

const loginURL = '/api/v1/auth/token';
const sendEmailURL = '/api/v1/sendMailtoAdmin';
const userInfoURL = '/api/v1/usersInfo';

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			isError: false,
			errorMessage: '',
			isLoading: false,
			authenticated: false
		};

		this.onUpdateUser = this.onUpdateUser.bind(this);
	}

	validateForm() {
		return this.state.username.length > 0 && this.state.password.length > 0;
	}

	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value,
			isError: false
		});
	};

	login = async (event) => {
		event.preventDefault();

		this.setState({ isLoading: true });

		const { username, password } = this.state;
		await API.post(
			loginURL,
			JSON.stringify({
				username: username,
				password: password
			})
		)
			.catch(error => {
			// console.log(error.response);
				this.setState({ isLoading: false });

				// console.log('BAD', error);
				this.setState({ isError: true });

				if (error.response) {
				//   console.log(error.response.status);
					if (error.response.status == 401) {
						this.setState({ errorMessage: error.response.data.message });
					} else if (error.response.status == 500) {
						this.setState({ errorMessage: 'Currently database disconnected.' });
						// send mail to admin
						this.sendingErrorMail(error.response.data);
					}
				}
			})
			.then(response => {
				if (response) {
					// console.log('GOOD', response);
					localStorage.setItem('Token', response.data.access_token);
					this.setState({ isError: false });
					this.fetchUserInfo();
				}
			});
	};

	/**
   * @description this will send mail when get 500
   */
	sendingErrorMail = async ($errData) => {
		let message = `DB disconnected for -- ${$errData}`;
		let subject = 'Database Error';

		let errorData = {
			message,
			subject
		};

		await API.post(sendEmailURL, errorData)
			.catch(error => {
				// console.log(error.response);
				if(error){
					// make something
				}
			})
			.then(response => {
				if (response) {
					// console.log('GOOD', response);
				}
			});
	};

	/**
   * @description this method will fetch the userInfo
   */
		fetchUserInfo = async () => {
			await API.get(`${userInfoURL}`)
				.catch(error => {
					// console.log('BAD', error);
					if(error){
						//make something
					}
				})
				.then(response => {
					if (response) {
						// this.setState({userDetail: response.data});
						const userData = {
							userID: response.data.id,
							firstName: response.data.firstName,
							lastName: response.data.lastName,
							email: response.data.email,
							role: response.data.role[0].role,
							r_id: response.data.role[0].id
						};

						localStorage.setItem('UserInfo', JSON.stringify(userData));

						window.location.href = '/dashboard';

						this.setState({ authenticated: true });
					}
				});
		};

		isAuthenticated() {
			const token = localStorage.getItem('Token');
			return token && token.length > 10;
		}

		onUpdateUser() {
			this.props.onUpdateUser('John');
		}

		render() {
			return (
				<div>
					<div className="full-page-content">
						<div className="login-page">
							{/* comment out this function to check the redux implementation */}
							{/* <p style={ { color: '#fff' } }>{this.props.user}</p>
							<button onClick={this.onUpdateUser.bind(this)}>Update User</button> */}

							<Container>
								<Col xs={ 12 } md={ 8 } lg={ 4 } className="ml-auto mr-auto">
									<form onSubmit={ this.login }>
										<Card className="card-login card-plain">
											<CardHeader />

											<CardBody>

												{this.state.isError && (
													<Alert color="danger">
														<span>
															{this.state.isError ? this.state.errorMessage : ''}
														</span>
													</Alert>
												)}

												<FormGroup controlId="username" bsSize="large">
													<ControlLabel>Username *</ControlLabel>
													<FormControl
														autoFocus
														type="username"
														value={ this.state.username }
														onChange={ this.handleChange }
													/>
												</FormGroup>
												<FormGroup controlId="password" bsSize="large">
													<ControlLabel>Password *</ControlLabel>
													<FormControl
														value={ this.state.password }
														onChange={ this.handleChange }
														type="password"
													/>
												</FormGroup>
												<CardFooter className="text-center">
													<Button
														color="primary"
														size="lg"
														block
														round
														disabled={ !this.validateForm() }
														type="submit"
														onChange={ this.handleChange }
													>
														{this.state.isLoading ? (
															<span>
																<i className="fa fa-spinner fa-spin" />
																&nbsp;Please wait...
															</span>
														) : (
															<span>Login</span>
														)}
													</Button>
												</CardFooter>
											</CardBody>
										</Card>
									</form>
								</Col>
							</Container>
						</div>
					</div>
					<div className="full-page-background" style={ { backgroundImage: 'url(' + bgImage + ')' } } />
				</div>
			);
		}

}

const mapStateToProps = (state) => {
	// console.log(state, props)
	return {
		user: state.user
	};
};

const mapActionToProps = (dispatch) => {
	return bindActionCreators(
		{
			onUpdateUser: updateUser
		},
		dispatch
	);
};

export default connect(mapStateToProps, mapActionToProps)(LoginPage);
