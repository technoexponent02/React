import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';
import {API} from '../../../physician_life_api/api';
import {
	Card, CardBody, Row, Col, Label, FormGroup
} from 'reactstrap';
import {PanelHeader, Button} from 'components';
import SweetAlert from 'react-bootstrap-sweetalert';
import './Question.css';
import {AccessManagement} from '../../AccessManagement/AccessManagement';


const questionURL = '/api/v1/questions';

class Question extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			question: [],
			next: 1,
			current: 1,
			previous: 1,
			currentPage: 1,
			lastPage: 1,
			alert: null,
			show: false,
			loadingState: false
		};

		this.confidentClick = this.confidentClick.bind(this);
		this.hideAlert = this.hideAlert.bind(this);
		this.errAlert = this.errAlert.bind(this);
		this.informationAlert = this.informationAlert.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.selectOption = this.selectOption.bind(this);
		this.pagination = this.pagination.bind(this);
	}


	hideAlert(){
		this.setState({
			alert: null
		});
	}


	informationAlert(){
		this.setState({
			alert: (
				<SweetAlert
					warning
					style={ {display: 'block',marginTop: '-100px'} }
					title="Warning!"
					onConfirm={ this.hideAlert }
					onCancel={ this.hideAlert }
					confirmBtnBsStyle="warning"
				>
					Choose one answer first
				</SweetAlert>
			)
		});
	}


	successAlert(){
		this.setState({
			alert: (
				<SweetAlert
					success
					style={ {display: 'block',marginTop: '-100px'} }
					title="Success!"
					onConfirm={ this.hideAlert }
					onCancel={ this.hideAlert }
					confirmBtnBsStyle="success"
				>
          Your answer is correct
				</SweetAlert>
			)
		});
	}


	errAlert(){
		this.setState({
			alert: (
				<SweetAlert
					error
					style={ {display: 'block',marginTop: '-100px'} }
					title="Wrong!"
					onConfirm={ this.hideAlert }
					onCancel={ this.hideAlert }
					confirmBtnBsStyle="error"
				>
					Your answer is incorrect
				</SweetAlert>
			)
		});
	}


		question = async () => {
			this.setState({loadingState: true});
			await API.get(`${questionURL}?page=${this.state.currentPage}`)
				.catch(error => {
					// console.log('BAD', error);
					if(error){
						// make something
					}
				})
				.then(
					response => {
						if (response) {
							this.state.question = response.data.data;
							this.setState({current: response.data.current_page});
							this.state.currentPage = 1;
							if (response.data.current_page !== 1) {
								this.state.previous = response.data.current_page - 1;
							} else {
								this.state.previous = '';
							}
							this.state.lastPage = response.data.last_page;
							this.state.next = response.data.current_page + 1;
							this.setState({loadingState: false});
						}
					}, this);
		}


		// lifeCycle hook
		componentDidMount() {
			// scroll top
			ReactDOM.findDOMNode(this).scrollIntoView();
			// get single question
			this.question(this.state.currentPage);
		}


		isAuthenticated() {
			const token = localStorage.getItem('Token');
			return token && token.length > 10;
		}


		pagination(e) {
			const page = e.target.value;
			this.state.currentPage = page;
			this.question();
		}


		confidentClick() {
			const {optionVal, question} = this.state;

			if(optionVal == ''){
				this.informationAlert();
			} else {
				if(optionVal == question.answer * 1) {
					this.successAlert();
				} else {
					this.errAlert();
				}
			}
		}



		render() {

			const question = this.state.question.map((q, i) => (
				<Card>
					<Row className="justify-content-center">
						<Col lg={ 12 } md={ 12 } xs={ 12 }>
							<CardBody>
								<span className="badge badge-info">{q.specialty}</span>
								<h5>{q.question}</h5>
								<div className="option-list">
									{q.options.map((item, i) => (
										<div key={ i }>
											<FormGroup check className="form-check-radio">
												<Label check>
													<input type="radio" name="radios"
														value={ item.id }
														checked={ item.id == q.answer }
														onChange={ this.selectOption }
													/>
													<span className="form-check-sign"></span>
													{item.option}
												</Label>
											</FormGroup>
										</div>
									))}
								</div>
							</CardBody>
						</Col>
					</Row>
					<Row className="justify-content-center">
						<Col lg={ 7 } md={ 7 } xs={ 12 } className="text-left">
							<Button onClick={ this.confidentClick } color="success" round>Confident</Button>
							<Button color="primary" round>Probable</Button>
							<Button color="warning" round>Maybe</Button>
							<Button color="danger" round>No idea</Button>
						</Col>
						<Col lg={ 4 } md={ 4 } xs={ 12 } className="text-right">
							<Button color="default" round>
								<i className="fa fa-flag"></i>&nbsp;
									Flag for review
							</Button>
						</Col>
					</Row>
				</Card>
			));

			return (
				<div className="question">
					{!this.isAuthenticated() ? <Redirect to="/pages"/> : '' }
					{AccessManagement() != 'trainee' ? <Redirect to="/"/> : ''}
					{this.state.alert}
					<PanelHeader size="sm"/>
					<div className="content">

						{this.state.loadingState == true &&
								<Row className="justify-content-center page-loader">
									<h5>
										<strong>
											<i className="fa fa-spinner fa-spin"></i>&nbsp;Loading...
										</strong>
									</h5>
								</Row>
						}
						{question}

						<Row className="q-paginate">
							<Col lg={ 6 }className="text-left">
								<Button
									disabled={ this.state.previous == '' }
									value ={ this.state.previous }
									onClick={ this.pagination }
									color="primary"
									round
									leftLabel="now-ui-icons arrows-1_minimal-left"
								>
									Previous
								</Button>
							</Col>
							<Col lg={ 6 } className="text-right">
								<Button
									disabled={ this.state.current == this.state.lastPage }
									value={ this.state.next }
									onClick={ this.pagination }
									color="primary"
									round
									rightLabel="now-ui-icons arrows-1_minimal-right"
								>
									Next
								</Button>
							</Col>
						</Row>
					</div>
				</div>
			);
		}
}

export default Question;