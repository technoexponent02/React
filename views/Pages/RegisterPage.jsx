
import React from 'react';
import { API } from '../../physician_life_api/api';
import {
	Card, CardHeader, CardTitle, CardBody, CardFooter,
	Container, Row, Col,
	Form, FormGroup, InputGroup, InputGroupAddon, Input, Label,Alert
} from 'reactstrap';
import Select from 'react-select';
import SweetAlert from 'react-bootstrap-sweetalert';
import { InfoArea, Button } from 'components';

import bgImage from 'assets/img/bg16.jpg';
const url1 = '/api/v1/trainingLocations/getLocations';
const url = '/api/v1/register';

class RegisterPage extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			user: {
				firstNameState: '',
				emailState: '',
				lastNameState: '',
				checkboxState:'',
				locationState:'',
				firstName: '',
				email: '',
				lastName: '',
				training_location:'',
				rollId:''
			},
			selectOptions:[],
			singleSelect:null,
			alert: null,
			show:false,
			isError:false,
			errorMessage:''
		};

		this.rollList = this.rollList.bind(this);
		this.checkbox = this.checkbox.bind(this);
		this.typeValidate = this.typeValidate.bind(this);
		this.loginFullName = this.loginFullName.bind(this);
		this.loginLastName = this.loginLastName.bind(this);
		this.registerEmail = this.registerEmail.bind(this);
	}


	registerEmail(e){
		var register = this.state.user;
		register['email'] = e.target.value;
		var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(emailRex.test(e.target.value)){
			register['emailState'] = 'has-success';
		} else {
			register['emailState'] = 'has-danger';
		}
		this.setState({register});
	}
	loginFullName(e){
		var login = this.state.user;
		login['firstName'] = e.target.value;
		if(/[a-z]/.test(e.target.value) || /[A-Z]/.test(e.target.value)){
			login['firstNameState'] = 'has-success';
		} else {
			login['firstNameState'] = 'has-danger';
		}
		this.setState({login});
	}
	loginLastName(e){
		var login = this.state.user;
		login['lastName'] = e.target.value;
		if(/[a-z]/.test(e.target.value) || /[A-Z]/.test(e.target.value)){
			login['lastNameState'] = 'has-success';
		} else {
			login['lastNameState'] = 'has-danger';
		}
		this.setState({login});
	}
	checkbox(e){
		var login = this.state.user;
		if(e.target.checked){
			login['checkboxState'] = 'has-success';
		} else {
			login['checkboxState'] = 'has-danger';
		}
		this.setState({login});
	}
	hideAlert() {
		this.setState({
			alert: null
		});
		window.location.reload();
	}
	successAlert() {
		this.setState({
			alert: (
				<SweetAlert
					success
					style={ { display: 'block', marginTop: '-100px' } }
					title="Success!"
					onConfirm={ () => this.hideAlert() }
					onCancel={ () => this.hideAlert() }
					confirmBtnBsStyle="success"
				>
            Thank you  for registration,
            We will send an Email to activate your account  soon
				</SweetAlert>
			)
		});
	}

	typeValidate() {
		var type = this.state.user;
		type.status=true;
		if (type['firstNameState'] !== 'has-success')
		{
			type['firstNameState'] = 'has-danger';
			type.status=false;
		}
		if (type['lastNameState'] !== 'has-success') {
			type['lastNameState'] = 'has-danger';
			type.status=false;
		}
		if (type['emailState'] !== 'has-success'){
			type['emailState'] = 'has-danger';
			type.status=false;
		}
		if (type['checkboxState'] !== 'has-success'){
			type['checkboxState'] = 'has-danger';
			type.status=false;
		}
		if (type['locationState'] !== 'has-success'){
			type['locationState'] = 'has-danger';
			type.status=false;
		}
		if(type.status){
			this.registerUser();
		}
		this.setState({ type });
	}
	registerUser = async () => {
		//event.preventDefault();
		const { firstName, lastName, training_location,rollId,email } = this.state.user;

		await API.post(
			url,
			JSON.stringify({
				firstName, lastName, email,training_location,rollId
			})
		)
			.catch(error => {
				if( error.response.status==400 ) {
					this.setState({isError:true});
					this.setState({errorMessage:error.response.data.email[0]});
				}
			})
			.then(response => {
				if (response) {
					// console.log('GOOD', response);
					this.successAlert();
				}
			});
	};

	getLocation=async () => {
		//event.preventDefault();
		API.get(`${url1}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
			})
			.then(
				response => {
					if (response) {
						let arr = response.data.map(l => ({
							value: l.id,
							label: l.hospital,
						}));
						// this.setState({ selectOptions: [...this.state.selectOptions, arr]});
						this.setState({selectOptions:  arr});
						// console.log(this.state.selectOptions1);
					}
				});
	}


	rollList(event){
		this.state={
			...this.state,
			singleSelect: event.value
		};
		this.setState(this.state );
		var format=this.state.user;
		format['training_location']=event.value;
		format['locationState']='has-success';

		format['rollId']=3;
		this.setState({ format });
		// console.log(this.state);
	}

	componentDidMount() {
		this.getLocation();
		var format=this.state.user;
		format['locationState']='has-danger';
		this.setState({ format });
	}

	render(){
		return (
			<div>
				{this.state.alert}
				<div className="full-page-content">
					<div className="register-page">
						<Container>
							<Row className="justify-content-center">
								<Col lg={ 5 } md={ 8 } xs={ 12 } className="mt-5">
									<InfoArea
										icon="now-ui-icons media-2_sound-wave"
										iconColor="primary"
										title="Marketing"
										titleColor="info"
										description="We've created the marketing campaign of the website. It was a very interesting collaboration."
									/>
									<InfoArea
										icon="now-ui-icons media-1_button-pause"
										iconColor="primary"
										title="Fully Coded in React 16"
										titleColor="info"
										description="We've developed the website with React 16, HTML5 and CSS3. The client has access to the code using GitHub."
									/>
									<InfoArea
										icon="now-ui-icons users_single-02"
										iconColor="info"
										title="Built Audience"
										titleColor="info"
										description="There is also a Fully Customizable CMS Admin Dashboard for this product."
									/>
								</Col>
								<Col lg={ 4 } md={ 8 } xs={ 12 }>
									<Card className="card-sign-up">
										<CardHeader className="text-center">
											<CardTitle>Register</CardTitle>
										</CardHeader>
										<CardBody>
											<Form>
												{this.state.isError && (
													<Alert color="danger">
														<span>
															{this.state.isError ? this.state.errorMessage : ''}
														</span>
													</Alert>
												)}
												<InputGroup className={ this.state.user.firstNameState }>
													<InputGroupAddon ><i className="now-ui-icons users_circle-08"></i></InputGroupAddon>
													<Input type="text" placeholder="First Name..." onChange={ this.loginFullName }/>
												</InputGroup>
												<InputGroup className={ this.state.user.lastNameState }>
													<InputGroupAddon ><i className="now-ui-icons text_caps-small"></i></InputGroupAddon>
													<Input type="text" placeholder="Last Name..."    onChange={  this.loginLastName } />
												</InputGroup>
												<InputGroup className={ this.state.user.emailState }>
													<InputGroupAddon ><i className="now-ui-icons ui-1_email-85"></i></InputGroupAddon>
													<Input type="email" placeholder="Email..." onChange={ this.registerEmail }/>
												</InputGroup>
												<FormGroup className={ this.state.user.locationState }>
													<Select
														className="primary"
														placeholder="Select Hospital"
														deleteRemoves={ false }
														clearable={ false }
														searchable={ false }
														name="singleSelect"
														value={ this.state.singleSelect }
														options={ this.state.selectOptions }
														onChange={ this.rollList }
													/>
												</FormGroup>
												<FormGroup className={ this.state.user.checkboxState }>
													<Label check>
														<Input type="checkbox"  onChange={ this.checkbox } />
														<span className="form-check-sign"></span>
														<div>I agree to the <a href="#something">terms and conditions</a>.</div>
													</Label>
												</FormGroup>
											</Form>
										</CardBody>
										<CardFooter className="text-center">
											<Button color="primary" size="lg" round onClick={ this.typeValidate }>
												Get Started
											</Button>
										</CardFooter>
									</Card>
								</Col>
							</Row>
						</Container>
					</div>
				</div>
				<div className="full-page-background" style={ {backgroundImage: 'url('+bgImage+')' } }></div>
			</div>
		);
	}
}

export default RegisterPage;
