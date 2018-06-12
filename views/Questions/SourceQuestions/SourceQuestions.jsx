import React from 'react';
import {Redirect} from 'react-router-dom';
import {API} from '../../../physician_life_api/api';
import {
	Row,
	Col,
} from 'reactstrap';
import { QuestionHeader } from 'presentational/QuestionHeader';
import { QuestionsCard } from 'presentational/QuestionsCard';
import {PanelHeader} from 'components';
import SweetAlert from 'react-bootstrap-sweetalert';
// import Select from 'react-select';
import {AccessManagement} from '../../AccessManagement/AccessManagement';
import {ErrorRedirect} from '../../../helpers/ErrorRedirect';
import InfiniteScroll from 'react-infinite-scroll-component';
import './SourceQuestions.css';

import { EnableSidebar, DisableSidebar, sidebarTimeout } from '../../../helpers/SidebarLoading';

const sourceQuestionsURL = '/api/v1/sourceQuestions/getQuestions';
const importURL = '/api/v1/importQuestions';
const questionsSpecialty = '/api/v1/sourceQuestionsSpecialty';



/**
 * SourceQuestions class component
 * @extends {React}
 */
class SourceQuestions extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			sourceQuestions: [],
			currentPage: 1,
			loadingState: true,
			alert: null,
			searchQuery: '',
			questionsCount: 0,
			specialtyList: [],
			selectedSpecialtyToFilterQuestions: null,
		};

		// Binding function calling
		this.hideAlert = this.hideAlert.bind(this);
		this.errorAlert = this.errorAlert.bind(this);
		this.makeAnswerChange = this.makeAnswerChange.bind(this);
		this.changeSpecialty = this.changeSpecialty.bind(this);
		this.clearFilter = this.clearFilter.bind(this);
		this.importQuestion = this.importQuestion.bind(this);
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
	 * This will show the error alert
	 * @param {string} msg this will be the alert message
	 */
	errorAlert(msg) {
		this.setState({
			alert: (
				<SweetAlert
					error
					style={ {display: 'block', marginTop: '-100px'} }
					title="Failed!"
					onConfirm={ this.hideAlert }
					onCancel={ this.hideAlert }
					confirmBtnBsStyle="error"
				>
					{msg}
				</SweetAlert>
			)
		});
	}

	/**
	 * This will fetch source questions
	 */
	fetchSourceQuestions = async () => {
		this.setState({loadingState: true});
		let url = `${sourceQuestionsURL}?page=${this.state.currentPage}`;

		let specialty = '';
		if(this.state.selectedSpecialtyToFilterQuestions) {
			specialty = this.state.selectedSpecialtyToFilterQuestions.label;
		}
		let data = {
			specialty: specialty,
			searchText: this.state.searchQuery
		};

		await API.post(url, data)
			.catch(error => {
				// console.log('BAD', error);
				DisableSidebar();
				if (error.response) {
					ErrorRedirect(error.response.status);
				}
			})
			.then(response => {
				if (response) {
					let nextData = response.data.data;
					this.state.questionsCount = response.data.total;
					this.setState({sourceQuestions: this.state.sourceQuestions.concat(nextData)});
					this.setState({loadingState: false});
					if(this.state.questionsCount == this.state.sourceQuestions.length){
						// show footer
						document.getElementsByClassName('footer')[0].classList.remove('hide-foot');
					}

					setTimeout(() => {
						DisableSidebar();
					}, sidebarTimeout);

				}
			});
	};

	/**
	 * This will make the search as per header search box
	 */
	searchQuestionsFromHeaderSearchField = async () => {
		this.setState({loadingState: true});
		this.state.searchQuery = this.props.searchText;
		this.state.sourceQuestions = [];
		this.state.currentPage = 1;
		// show footer
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchSourceQuestions();
	}


	/**
	 * React lifeCycle hook when component ready
	 */
	async componentDidMount() {
		EnableSidebar();

		document.getElementsByClassName('wrapper')[0].classList.add('inif');
		this.props.searchSourceQuestions(this.searchQuestionsFromHeaderSearchField.bind(this)).bind(this);
		this.setState({
			loadingState: false
		});
		// fetch Specialty list
		this.fetchSpecialty();

		// hide footer
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		await this.fetchSourceQuestions();
	}

	/**
	 * React lifeCycle hook when component getting destroy
	 */
	componentWillUnmount() {
		document.getElementsByClassName('wrapper')[0].classList.remove('inif');
		// show footer
		document.getElementsByClassName('footer')[0].classList.remove('hide-foot');
	}

	/**
	 * This will check user authentication
	 */
	isAuthenticated() {
		const token = localStorage.getItem('Token');
		return token && token.length > 10;
	}

	/**
	 * This will post the import question 
	 */
	postImportQuestion = async (item)=> {
		const importedQuestion = [item];
		// let questions = this.state.sourceQuestions.slice();
		// questions.splice(item, 1);
		// this.setState({sourceQuestions: questions});
		await API.post(importURL, importedQuestion)
			.catch(error => {
				if(error){
					// make something
				}
				this.setState({
					loadingState: false
				});
				this.errorAlert('Failed to import selected questions!');

			}).then(
				response => {
					if (response) {
						// make something
					} else {
						this.errorAlert('Failed to import selected questions!');
					}
				});
	}

	/**
	 * This will init the import question
	 */
	importQuestion = async (e)=> {
		const item = JSON.parse(e.target.value);
		this.makeAnimate(item);

		setTimeout(()=> {
			this.postImportQuestion(item);
		}, 100);
	}

	/**
	 * This will make the animation as per import question
	 * @param {Object} item this is the single question object
	 */
	makeAnimate(item){
		// console.log(item.id)
		this.state.sourceQuestions.map(value => {
			if (value.id == item.id) {
				// value.option = event.target.value;
				// console.log(value)
				value.remove = true;
			}
		});
		// this.state.selectedQuestionDataEdited = true;
		this.setState({});
	}


	/**
	 * This method will fetch the specialty list
	 */
	fetchSpecialty = async () => {
		await API.get(`${questionsSpecialty}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
				}
			})
			.then(response => {
				if (response) {
					this.setState({specialtyList: response.data});
				}
			});
	};

	/**
	 * This will clear the filter data
	 */
	clearFilter() {
		this.state.sourceQuestions = [];
		this.setState({searchQuery:''});
		this.setState({selectedSpecialtyToFilterQuestions: null});
		this.setState({loadingState: true});
		// hide footer
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchSourceQuestions();
	}


	/**
	 * This will check the change Specialty filter
	 * @param {Object} value this will get the specialty value on change
	 */
	changeSpecialty(value) {
		this.state.currentPage = 1;
		this.state.sourceQuestions = [];
		this.state.selectedSpecialtyToFilterQuestions = value;
		this.setState({selectedSpecialtyToFilterQuestions: value});
		// hide footer
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchSourceQuestions();
	}


	/**
	 * This will make the fetch the
	 * latest data when user scroll down
	 */
	fetchData = async () => {
		this.state.currentPage = this.state.currentPage + 1;
		await this.fetchSourceQuestions();
	};


	/**
	 * @ignore
	 */
	makeAnswerChange(){
		// nothing to do right now
	}


	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {

		return (
			<div className="questions">
				{!this.isAuthenticated() ? <Redirect to="/pages"/> : ''}
				{AccessManagement() == 'trainee' ? <Redirect to="/"/> : ''}
				{this.state.alert}

				<PanelHeader size="sm"/>
				<div className="content">
					{this.state.loadingState == true &&
						<Row className="justify-content-center page-loader">
							<h5>
								<strong>
									<i className="fa fa-spinner fa-spin"/>&nbsp;Loading...
								</strong>
							</h5>
						</Row>
					}


					<div className="questionList">
						<Row className="justify-content-center">
							{this.state.loadingState == false &&
								<Col lg={ 12 } md={ 12 } xs={ 12 }>
									<QuestionHeader
										importedByMeOn={ false }
										isImportedByMe= { this.state.isImportedByMe }
										importedByMe= { this.importedByMe }
										tagsList= ''
										selectedTags= ''
										changeTag= ''
										searchFilter= { this.state.searchQuery }
										questionsCount= { this.state.questionsCount }
										selectedSpecialty= { this.state.selectedSpecialtyToFilterQuestions }
										specialtyList= { this.state.specialtyList }
										changeSpecialty= { this.changeSpecialty }
										clearFilter= { this.clearFilter }
									/>
								</Col>
							}

							<Col lg={ 12 } md={ 12 } xs={ 12 } className="q-inif">
								<InfiniteScroll
									pullDownToRefresh={ false }
									dataLength={ this.state.sourceQuestions.length } //This is important field to render the next data
									pullDownToRefreshContent={
										<h3 style={ {textAlign: 'center'} }>&#8595; Pull down to refresh</h3>
									}
									releaseToRefreshContent={
										<h3 style={ {textAlign: 'center'} }>&#8593; Release to refresh</h3>
									}
									// refreshFunction={ this.refresh }
									next={ this.fetchData }
									hasMore={ true }
									endMessage={
										<p style={ {textAlign: 'center'} }>
											<b>Yay! You have seen it all</b>
										</p>
									}
								>
									<QuestionsCard
										questionList= { this.state.sourceQuestions }
										makeAnswerChange= { this.makeAnswerChange }
										verifiedQuestionArray= { this.state.verifiedQuestionArray }
										importQuestion= { this.importQuestion }
										isImported= { false }
										isSubmitted= { false }
										suggestionsTags= ''
										getComments= ''
										disableButton= ''
										showQuestionToEditForPublication= ''
										submitChangedQuestionForPublication= ''
										suggestedToggle= ''
										rejectToggle= ''
										approveForPublication= ''
									/>
								</InfiniteScroll>

							</Col>

						</Row>

					</div>

				</div>
			</div>
		);
	}
}

export default SourceQuestions;
