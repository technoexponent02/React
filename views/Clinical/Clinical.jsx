
// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import ClinicalDoCase from './ClinicalDoCase';

import { Redirect } from 'react-router-dom';
// react component for creating dynamic tables
import ReactTable from 'react-table';
// react plugin used to create DropdownMenu for selecting items
import Select from 'react-select';
import { API } from '../../physician_life_api/api';
import { EnableSidebar, DisableSidebar, sidebarTimeout } from '../../helpers/SidebarLoading';
import {
	Card,
	CardBody,
	Row,
	Col
} from 'reactstrap';
import { PanelHeader } from 'components';
import { Button } from 'components';

var clinicalUrl = '/api/v1/clinicalCases/getCases';
var reachOnInit = false;
const hospitalUrl = '/api/v1/trainingLocations';
const specialtiesUrl = '/api/v1/specialties';

var caseOptions = [
	{ value: 1, label: 'Short' },
	{ value: 2, label: 'Long' },
];



/**
 * Clinical class component
 * @extends {React}
 */
class Clinical extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			hospitalSelect: null,
			caseTypeSelect: null,
			specialtySelect: null,
			clinicalCasesList: [],
			pages: '',
			nextPageUrl: '',
			prePageUrl: '',
			prevPageState: false,
			lastPageState: false,
			loadingState: true,
			caseTypeList: [],
			hospitalList: [],
			specialtyList: [],
			specialtyDoCase: 0,
			specialtyDoCaseTitle: '',
			activeDoCase: false
		};

		// Binding function calling
		this.fetchData = this.fetchData.bind(this);
		this.handleBackClickFromDoCase = this.handleBackClickFromDoCase.bind(this);
		this.openDoCase = this.openDoCase.bind(this);
		this.selectHospital = this.selectHospital.bind(this);
		this.selectCaseType = this.selectCaseType.bind(this);
		this.selectSpecialty = this.selectSpecialty.bind(this);
	}

	/**
	 * this will get the specialties form database
	 */
	getSpecialties = async () => {
		API.get(`${specialtiesUrl}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
				DisableSidebar();
			})
			.then(response => {
				if (response) {
					this.setState({ specialtyList: response.data });

					// make loading state false
					this.setState({ loadingState: false });

					setTimeout(() => {
						DisableSidebar();
					}, sidebarTimeout);
				}
			});
	};

	/**
	 * this will get the location form database
	 */
	getLocation = async () => {
		API.get(`${hospitalUrl}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error) {
					// make things
				}
			})
			.then(response => {
				if (response) {
					// modify the object
					let data = response.data.map(l => ({value: l.id, label: l.hospital}));
					this.setState({ hospitalList: data });

					// get pathology data
					this.getSpecialties();
				}
			});
	};


	/**
	 * this will get the clinical case form database
	 * with the paginated structure
	 *  @param {Object} formData pass the object for filtering the the data table
	 */
	allClinicalCases = async (formData) => {
		await API.post(
			clinicalUrl,
			formData
		)
			.catch(error => {
				// console.log('BAD', error);
				if(error) {
					// make things
				}
			})
			.then(response => {
				if (response) {
					// console.log('GOOD', response);
					if(response.status === 200){
						clinicalUrl = '/api/v1/clinicalCases/getCases';

						this.setState({ pages: response.data.last_page });

						// console.log(response.data.data);
						this.setState({ clinicalCasesList: response.data.data });

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
					}
				}
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
	 * This will call for fetching the all clinical case data
	 * and also get the next previous data when we will use the pagination
	 * @param {Object} state this will get the data table on change state object
	 */
	fetchData(state) {
		const {hospitalSelect, specialtySelect, caseTypeSelect} = this.state;

		const localObj= {
			case_type: caseTypeSelect,
			specialty: specialtySelect,
			hospitals: hospitalSelect
		};

		if (reachOnInit) {
			reachOnInit = false;

			this.allClinicalCases(localObj);
		} else {
			clinicalUrl = `${clinicalUrl}?page=${state.page + 1}&limit=${state.pageSize}`;
			// console.log(clinicalUrl)
			this.allClinicalCases(localObj);
		}
	}


	/**
	 * React lifeCycle hook when component ready
	 */
	componentDidMount() {
		EnableSidebar();
		// scroll top
		ReactDOM.findDOMNode(this).scrollIntoView();

		reachOnInit = true;
		this.allClinicalCases({});

		// get location and also method chaining
		this.getLocation();
	}

	/**
	 * This will filter the data as per top filter
	 */
	filterFunction(){
		setTimeout(() => {
			const {hospitalSelect, specialtySelect, caseTypeSelect} = this.state;

			const localObj= {
				case_type: caseTypeSelect,
				specialty: specialtySelect,
				hospitals: hospitalSelect
			};

			this.allClinicalCases(localObj);

		}, 200);
	}

	/**
	 * This ill get the on changed value of hospital
	 * @param {Object} item this will take the single selected hospital data object
	 */
	selectHospital(item){
		this.setState({ hospitalSelect: item});
		this.filterFunction();
	}

	/**
	 * This ill get the on changed value of case type
	 * @param {Object} item this will take the single selected case type data object
	 */
	selectCaseType(item){
		this.setState({ caseTypeSelect: item});
		this.filterFunction();
	}

	/**
	 * This ill get the on changed value of specialty
	 * @param {Object} item this will take the single selected specialty data object
	 */
	selectSpecialty(item){
		this.setState({ specialtySelect: item});
		this.filterFunction();
	}

	/**
	 * This will open the do cases view
	 * @param {*} e this will get the on click event object
	 */
	openDoCase(e){
		const item = JSON.parse(e.target.value);
		this.setState({ specialtyDoCase: item.specialty[0].id*1 });
		this.setState({ specialtyDoCaseTitle: item.specialty[0].specialty });
		this.setState({ activeDoCase: true });
	}

	/**
	 * Back from the clinical do case view to
	 * all clinical cases view
	 */
	handleBackClickFromDoCase() {
		this.setState({ specialtyDoCase: 0 });
		this.setState({ specialtyDoCaseTitle: '' });
		this.setState({ activeDoCase: false });
	}


	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {

		return (
			<div className="clinical">
				{!this.isAuthenticated() ? <Redirect to="/pages" /> : ''}
				<PanelHeader size="sm" />

				{ this.state.activeDoCase === false ?
					<div className="content">
						<Row className="justify-content-center">
							<Col lg={ 12 } md={ 12 } xs={ 12 }>
								<Card>
									<CardBody>
										{ this.state.loadingState === true ?

											<div className="card-load main-table-area">
												<div className="animated-background"></div>
												<div className="animated-background"></div>
												<div className="animated-background"></div>
												<div className="animated-background"></div>
											</div>

											:

											<div>
												<div className="header_gray">
													<div className="row">
														<div className="col-md-4 selectBoxWrap">
															<div>Hospital</div>
															<div className="blue-select">
																<Select
																	className="primary"
																	placeholder="Select hospital"
																	name="hospitalSelect"
																	value={ this.state.hospitalSelect }
																	options={ this.state.hospitalList }
																	onChange={ this.selectHospital }
																/>
															</div>
														</div>
														<div className="col-md-4 selectBoxWrap">
															<div>Case type</div>
															<div className="blue-select">
																<Select
																	className="primary"
																	placeholder="Select case type"
																	name="caseTypeSelect"
																	value={ this.state.caseTypeSelect }
																	options={ caseOptions }
																	onChange={ this.selectCaseType }
																/>
															</div>
														</div>
														<div className="col-md-4 selectBoxWrap">
															<div>Specialty</div>
															<div className="blue-select">
																<Select
																	className="primary"
																	placeholder="Select specialty"
																	name="specialtySelect"
																	value={ this.state.specialtySelect }
																	options={ this.state.specialtyList }
																	onChange={ this.selectSpecialty }
																/>
															</div>
														</div>
													</div>
												</div>
												<div className="main-table-area">
													<h3>Clinical cases</h3>
													<ReactTable
														manual
														data={ this.state.clinicalCasesList }
														pages={ this.state.pages }
														onFetchData={ this.fetchData }
														columns={ [
															{
																Header: '#',
																accessor: 'id',
																width: 40,
																sortable: false,
																filterable: false
															},
															{
																Header: 'Name',
																accessor: 'name',
																width: 150
															},
															{
																Header: 'Age',
																accessor: 'age',
																sortable: false,
																filterable: false,
																width: 80
															},
															{
																Header: 'MRN',
																accessor: 'mrn',
																sortable: false,
																filterable: false,
																width: 120
															},
															{
																Header: 'Location',
																accessor: 'location',
																sortable: false,
																filterable: false,
																width: 120
															},
															{
																Header: '',
																filterable: false,
																sortable: false,
																Cell: row => (
																	<div className="text-right" style={ {padding: '8px 0'} }>
																		<Button color="success" round>System</Button>{ ' ' }
																		<Button color="primary" round>Stem</Button>{ ' ' }
																		<Button color="warning" round>Short case name</Button>{ ' ' }
																		<Button
																			value={ JSON.stringify(row.original) }
																			onClick={ this.openDoCase }
																			color="danger" round
																		>
																			Do case
																		</Button>
																	</div>
																)
															}
														] }
														defaultPageSize={ 10 }
														className=""
													/>
												</div>
											</div>
										}
									</CardBody>
								</Card>
							</Col>
						</Row>
					</div>
					:
					<ClinicalDoCase
						specialty={ this.state.specialtyDoCase }
						specialtyTitle={ this.state.specialtyDoCaseTitle }
						onClick={ this.handleBackClickFromDoCase }
					>
					</ClinicalDoCase>
				}

			</div>
		);
	}
}

export default Clinical;
