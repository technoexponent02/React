import React from 'react';
import ReactDOM from 'react-dom';
import {
	Card,
	CardBody,
	Row,
	Col
} from 'reactstrap';
import { Button } from 'components';

import { ClinicalDoCaseChecklist } from 'presentational/ClinicalDoCaseChecklist';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/minimal-example.css';
import { API } from '../../physician_life_api/api';

const doCaseUrl = 'api/v1/clinicalCases/getSections';



/**
 * ClinicalDoCase class component
 * @extends {React}
 */
class ClinicalDoCase extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			specialtyId: 0,
			loadingState: true,
			doCasesList: [],
			caseList: []
		};

		// Binding function calling
		this.handleChangeChk = this.handleChangeChk.bind(this);
		this.saveData = this.saveData.bind(this);
	}



	/**
	 * This will get the do cases as per clinical case id
	 * @param {number} id this will hold the specialty id value
	 */
	getDoCases = async (id) => {
		API.post(doCaseUrl, { 'specialty': id })
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
				this.setState({ loadingState: false });
			})
			.then(response => {
				if (response) {
					this.setState({ doCasesList: response.data });
					this.setState({ loadingState: false });
					ReactDOM.findDOMNode(this).scrollIntoView();
				}
			});
	};

	/**
	 * React lifeCycle hook when component ready
	 */
	componentDidMount(){
		// set the prob state
		this.setState({ specialtyId: this.props.specialty });

		setTimeout(() => {
			const { specialtyId } = this.state;
			this.getDoCases(specialtyId);
		}, 100);
	}

	handleChangeChk(e) {
		const localData = {
			label: e.target.value,
			id: e.target.id*1
		};
		// console.log(e.target.checked)
		if(e.target.checked){
			this.setState({ caseList: [...this.state.caseList, localData]});
		} else {
			setTimeout(() => {
				const { caseList } = this.state;
				const newValue = caseList.filter(m => m.id != localData.id);
				this.setState({ caseList: newValue});
			}, 200);
		}
	}

	saveData() {
		const { caseList } = this.state;
		console.log(caseList)
	}


	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {

		return (
			<div className="content">
				<div className="clinical-do">

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
													<div className="col-md-6">
														<h2>
															<i
																className="now-ui-icons arrows-1_minimal-left"
																onClick={ this.props.onClick }
															></i>
															Sections
														</h2>
													</div>
													<div className="col-md-6 text-right">
														<Button round color="primary">Save</Button>
													</div>
												</div>
											</div>

											<div className="main-table-area">
												<h2 style={ {fontSize: '25px', color: '#2ca8ff'} }>{ this.props.specialtyTitle }</h2>

												{/* <pre>{JSON.stringify(this.state.doCasesList, null, 2)}</pre> */}
												<ClinicalDoCaseChecklist
													doCaseList= { this.state.doCasesList }
													handleChangeChk= { this.handleChangeChk }
												/>

												<div className="buttonHolder text-center">
													<Button round color="primary" onClick={ this.saveData }>Save</Button>
												</div>
											</div>

										</div>
									}

								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default ClinicalDoCase;
