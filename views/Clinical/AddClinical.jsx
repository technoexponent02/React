// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { API } from '../../physician_life_api/api';
import {
	EnableSidebar,
	DisableSidebar,
	sidebarTimeout
} from '../../helpers/SidebarLoading';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { PanelHeader } from 'components';
import { Button } from 'components';
import Select from 'react-select';
import SweetAlert from 'react-bootstrap-sweetalert';

const pathologyUrl = '/api/v1/shorts';
const specialtiesUrl = '/api/v1/specialties';
const findingsUrl = '/api/v1/findings';
const hospitalUrl = '/api/v1/trainingLocations';
const clinicalCase = '/api/v1/clinicalCases';

var caseOptions = [
	{ value: 1, label: 'Short' },
	{ value: 2, label: 'Long' }
];

/**
 * AddClinical class component
 * @extends {React}
 */
class AddClinical extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			btnDisable: false,
			caseTypeSelect: null,
			specialtySelect: null,
			hospitalSelect: null,
			pathologySelect: null,
			findingSelect: null,
			name: '',
			age: '',
			mrn: '',
			location: '',
			caseTypeList: [],
			specialtyList: [],
			pathologyList: [],
			findingList: [],
			hospitalList: [],
			loadingState: true,
			redirect: false,
			alert: null,
			age_err: [],
			case_type_err: [],
			location_err: [],
			mrn_err: [],
			name_err: [],
			specialty_err: [],
			pathology_err: [],
			finding_err: [],
			hospital_err: [],
			disabledFinding: true
		};

		// Binding function calling
		this.hideAlert = this.hideAlert.bind(this);
		this.AddClinicalSubmit = this.AddClinicalSubmit.bind(this);
		this.changeName = this.changeName.bind(this);
		this.changeAge = this.changeAge.bind(this);
		this.changeMrn = this.changeMrn.bind(this);
		this.changeLocation = this.changeLocation.bind(this);
		this.changeSpecialtyHandle = this.changeSpecialtyHandle.bind(this);
		this.changeCaseHandle = this.changeCaseHandle.bind(this);
		this.changePathologyHandle = this.changePathologyHandle.bind(this);
		this.changeFindingHandle = this.changeFindingHandle.bind(this);
		this.changeHospitalHandle = this.changeHospitalHandle.bind(this);
	}

	/**
	 * This will hide the alert box
	 */
	hideAlert() {
		this.setState({ alert: null });
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
					Successfully added new clinical case
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
					Please enter all fields
				</SweetAlert>
			)
		});
	}

	/**
	 * This will add the new clinical case
	 * @param {Object} formData this main form data for adding the clinical case
	 */
	handleSubmit = async formData => {
		// make button disable
		this.setState({ btnDisable: true });

		await API.post(clinicalCase, formData)
			.catch(error => {
				// console.log('BAD', error);
				if (error.response) {
					// make button enable
					this.setState({ btnDisable: false });
					if (error.response.status === 400) {
						// this.errAlert();
						// console.log(error.response.data.age)
						error.response.data.age != undefined
							? this.setState({ age_err: error.response.data.age })
							: this.setState({ age_err: [] });
						error.response.data.name != undefined
							? this.setState({ name_err: error.response.data.name })
							: this.setState({ name_err: [] });
						error.response.data.mrn != undefined
							? this.setState({ mrn_err: error.response.data.mrn })
							: this.setState({ mrn_err: [] });
						error.response.data.location != undefined
							? this.setState({ location_err: error.response.data.location })
							: this.setState({ location_err: [] });
						error.response.data.case_type != undefined
							? this.setState({ case_type_err: error.response.data.case_type })
							: this.setState({ case_type_err: [] });
						error.response.data.specialty != undefined
							? this.setState({ specialty_err: error.response.data.specialty })
							: this.setState({ specialty_err: [] });
						error.response.data.pathologies != undefined
							? this.setState({ pathology_err: error.response.data.pathologies })
							: this.setState({ pathology_err: [] });
						error.response.data.findings != undefined
							? this.setState({ finding_err: error.response.data.findings })
							: this.setState({ finding_err: [] });
						error.response.data.hospital_id != undefined
							? this.setState({ hospital_err: error.response.data.hospital_id })
							: this.setState({ hospital_err: [] });
					}
				}
			})
			.then(response => {
				if (response) {
					// make button enable
					this.setState({ btnDisable: false });
					// console.log('GOOD', response);
					if (response.status === 200) {
						this.successAlert();
						setTimeout(() => {
							this.setState({ redirect: true });
						}, 1500);
					}
				}
			});
	};

	/**
	 * This will get the all findings from the database
	 * @param {Object} pathologyArray this will take the selected pathology object
	 */
	getFindings = async (pathologyArray) => {
		API.post(`${findingsUrl}`, pathologyArray)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// do something
				}
				DisableSidebar();
			})
			.then(response => {
				if (response) {
					this.setState({ findingList: response.data });
				}
			});
	};


	/**
	 * This will get the all specialties from the database
	 */
	getSpecialties = async () => {
		API.get(`${specialtiesUrl}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
			})
			.then(response => {
				if (response) {
					this.setState({ specialtyList: response.data });
					// console.log(response.data.map(m => m.value))
					// get findings
					// this.getFindings();
					this.setState({ loadingState: false });
					setTimeout(() => {
						DisableSidebar();
					}, sidebarTimeout);
				}
			});
	};

	/**
	 * This will get the all pathology from the database
	 */
	getPathology = async () => {
		API.get(`${pathologyUrl}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
			})
			.then(response => {
				if (response) {
					this.setState({ pathologyList: response.data });

					// get all specialties
					this.getSpecialties();
				}
			});
	};


	/**
	 * This will get the all location from the database
	 */
	getLocation = async () => {
		API.get(`${hospitalUrl}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
			})
			.then(response => {
				if (response) {
					// modify the object
					let data = response.data.map(l => ({
						value: l.id,
						label: l.hospital
					}));
					this.setState({ hospitalList: data });

					// get pathology data
					this.getPathology();
				}
			});
	};

	/**
	 * React lifeCycle hook when component ready
	 */
	componentDidMount() {
		EnableSidebar();
		// scroll top
		ReactDOM.findDOMNode(this).scrollIntoView();
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
	 * This will make name changes
	 * @param {*} e on change event object
	 */
	changeName(e) {
		this.setState({ name: e.target.value });
		this.setState({ name_err: [] });
	}

	/**
	 * This will make age changes
	 * @param {*} e on change event object
	 */
	changeAge(e) {
		this.setState({ age: e.target.value });
		this.setState({ age_err: [] });
	}

	/**
	 * This will make mrn changes
	 * @param {*} e on change event object
	 */
	changeMrn(e) {
		this.setState({ mrn: e.target.value });
		this.setState({ mrn_err: [] });
	}

	/**
	 * This will make location changes
	 * @param {*} e on change event object
	 */
	changeLocation(e) {
		this.setState({ location: e.target.value });
		this.setState({ location_err: [] });
	}

	/**
	 * This will submit the add clinical form data
	 * @param {*} e on change event object
	 */
	AddClinicalSubmit(e) {
		e.preventDefault();

		const {
			name,
			age,
			mrn,
			location,
			caseTypeSelect,
			specialtySelect,
			hospitalSelect,
			pathologySelect,
			findingSelect
		} = this.state;

		const localObj = {
			name,
			age,
			mrn,
			location,
			case_type: caseTypeSelect !== null ? caseTypeSelect.value : null,
			specialty: specialtySelect !== null ? specialtySelect.value : null,
			hospital_id: hospitalSelect !== null ? hospitalSelect.value : null,
			pathologies: pathologySelect !== null ? pathologySelect.map(m => m.value) : null,
			findings: findingSelect !== null ? findingSelect.map(m => m.value) : null
		};

		// console.log(localObj);
		this.handleSubmit(localObj);
	}

	/**
	 * This will make the change case handle
	 * @param {Object} item this will store the single case item
	 */
	changeCaseHandle(item) {
		this.setState({ caseTypeSelect: item });
		this.setState({ case_type_err: [] });
	}

	/**
	 * This will make the change specialty handle
	 * @param {Object} item this will store the single specialty item
	 */
	changeSpecialtyHandle(item) {
		this.setState({ specialtySelect: item });
		this.setState({ specialty_err: [] });
	}

	/**
	 * This will make the change pathology handle
	 * @param {Object} item this will store the single pathology item
	 */
	changePathologyHandle(item) {
		this.setState({ pathologySelect: item });
		this.setState({ pathology_err: [] });
		setTimeout(() => {
			const { pathologySelect } = this.state;
			if(pathologySelect.length > 0){
				this.setState({ disabledFinding: false });

				const makePathologyArray = {
					'shorts': pathologySelect.map(m => m.value)
				};
				this.getFindings(makePathologyArray);
			} else {
				this.setState({ disabledFinding: true });
				this.setState({ findingList: [] });
				this.setState({ findingSelect: [] });
			}
		}, 200);

	}

	/**
	 * This will make the change finding handle
	 * @param {Object} item this will store the single finding item
	 */
	changeFindingHandle(item) {
		this.setState({ findingSelect: item });
		this.setState({ finding_err: [] });
	}

	/**
	 * This will make the change hospital handle
	 * @param {Object} item this will store the single hospital item
	 */
	changeHospitalHandle(item) {
		this.setState({ hospitalSelect: item });
		this.setState({ hospital_err: [] });
	}


	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {
		return (
			<div className="clinical add-clinical">
				{this.state.redirect ? <Redirect to="/clinical" /> : ''}
				{!this.isAuthenticated() ? <Redirect to="/pages" /> : ''}
				{this.state.alert}
				<PanelHeader size="sm" />
				<div className="content">
					<Row className="justify-content-center">
						<Col lg={ 12 } md={ 12 } xs={ 12 }>
							<Card>
								<CardBody>
									<div className="header_gray">
										<div className="row">
											<div className="col-md-12">
												<h2 className="add-clinical-heading">
													Add Clinical Case
												</h2>
											</div>
										</div>
									</div>
									<div className="main-clinical-area">
										{this.state.loadingState === true ? (
											<div className="card-load">
												<div className="animated-background" />
												<div className="animated-background" />
												<div className="animated-background" />
												<div className="animated-background" />
											</div>
										) : (
											<form
												className="form-horizontal"
												onSubmit={ this.AddClinicalSubmit }
											>
												<div className="row">
													<div className="col-md-2">
														<label className="col-form-label col-md-12">
															Name
														</label>
													</div>
													<div className="col-md-10">
														<div className="form-group">
															<input
																type="text"
																onChange={ this.changeName }
																className="form-control"
															/>
															<small className="form-text text-danger">
																{this.state.name_err.length > 0
																	? this.state.name_err[0]
																	: ''}
															</small>
														</div>
													</div>
												</div>

												<div className="row">
													<div className="col-md-2">
														<label className="col-form-label col-md-12">
															Age
														</label>
													</div>
													<div className="col-md-4">
														<div className="form-group">
															<input
																type="text"
																onChange={ this.changeAge }
																className="form-control"
															/>
															<small className="form-text text-danger">
																{this.state.age_err.length > 0
																	? this.state.age_err[0]
																	: ''}
															</small>
														</div>
													</div>

													<div className="col-md-2">
														<label className="col-form-label col-md-12">
															MRN
														</label>
													</div>
													<div className="col-md-4">
														<div className="form-group">
															<input
																type="text"
																maxLength="8"
																onChange={ this.changeMrn }
																className="form-control"
															/>
															<small className="form-text text-danger">
																{this.state.mrn_err.length > 0
																	? this.state.mrn_err[0]
																	: ''}
															</small>
														</div>
													</div>
												</div>

												<div className="row">
													<div className="col-md-2">
														<label className="col-form-label col-md-12">
															Location
														</label>
													</div>
													<div className="col-md-10">
														<div className="form-group">
															<input
																type="text"
																onChange={ this.changeLocation }
																className="form-control"
															/>
															<small className="form-text text-danger">
																{this.state.location_err.length > 0
																	? this.state.location_err[0]
																	: ''}
															</small>
														</div>
													</div>
												</div>

												<div className="row">
													<div className="col-md-2">
														<label className="col-form-label col-md-12">
															Case Type
														</label>
													</div>
													<div className="col-md-4">
														<div className="form-group">
															<Select
																className="primary"
																placeholder="Select case type"
																name="caseTypeSelect"
																value={ this.state.caseTypeSelect }
																options={ caseOptions }
																onChange={ this.changeCaseHandle }
															/>
															<small className="form-text text-danger">
																{this.state.case_type_err.length > 0
																	? this.state.case_type_err[0]
																	: ''}
															</small>
														</div>
													</div>

													<div className="col-md-2">
														<label className="col-form-label col-md-12">
															Specialty
														</label>
													</div>
													<div className="col-md-4">
														<div className="form-group">
															<Select
																className="primary"
																placeholder="Select specialty"
																name="specialtySelect"
																value={ this.state.specialtySelect }
																options={ this.state.specialtyList }
																onChange={ this.changeSpecialtyHandle }
															/>
															<small className="form-text text-danger">
																{this.state.specialty_err.length > 0
																	? this.state.specialty_err[0]
																	: ''}
															</small>
														</div>
													</div>
												</div>

												<div className="row">
													<div className="col-md-2">
														<label className="col-form-label col-md-12">
															Pathology
														</label>
													</div>
													<div className="col-md-4">
														<div className="form-group">
															<Select
																className="primary"
																multi={ true }
																closeOnSelect={ false }
																placeholder="Select pathology"
																name="multipleSelect"
																value={ this.state.pathologySelect }
																options={ this.state.pathologyList }
																onChange={ this.changePathologyHandle }
															/>
															<small className="form-text text-danger">
																{this.state.pathology_err.length > 0
																	? this.state.pathology_err[0]
																	: ''}
															</small>
														</div>
													</div>

													<div className="col-md-2">
														<label className="col-form-label col-md-12">
															Finding
														</label>
													</div>
													<div className="col-md-4">
														<div className="form-group">
															<Select
																className="primary"
																multi={ true }
																disabled={ this.state.disabledFinding }
																closeOnSelect={ false }
																placeholder="Select finding"
																name="multipleSelect"
																value={ this.state.findingSelect }
																options={ this.state.findingList }
																onChange={ this.changeFindingHandle }
															/>
															<small className="form-text text-danger">
																{this.state.finding_err.length > 0
																	? this.state.finding_err[0]
																	: ''}
															</small>
														</div>
													</div>
												</div>

												<div className="row">
													<div className="col-md-2">
														<label className="col-form-label col-md-12">
															Hospital
														</label>
													</div>
													<div className="col-md-10">
														<div className="form-group">
															<Select
																className="primary"
																placeholder="Select hospital"
																name="hospitalSelect"
																value={ this.state.hospitalSelect }
																options={ this.state.hospitalList }
																onChange={ this.changeHospitalHandle }
															/>
															<small className="form-text text-danger">
																{this.state.hospital_err.length > 0
																	? this.state.hospital_err[0]
																	: ''}
															</small>
														</div>
													</div>
												</div>

												<div className="row">
													<div className="col-md-12 text-center">
														<Button
															round
															disabled={ this.state.btnDisable }
															type="submit"
															color="primary"
														>
															Save clinical case
														</Button>
													</div>
												</div>
											</form>
										)}
									</div>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default AddClinical;
