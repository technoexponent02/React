// @flow
import React from 'react';
import $ from 'jquery';
import {Redirect} from 'react-router-dom';
import {API} from '../../../physician_life_api/api';
import {AccessManagement} from '../../AccessManagement/AccessManagement';
import {ErrorRedirect} from '../../../helpers/ErrorRedirect';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
	Row,
	Col
} from 'reactstrap';

import { QuestionHeader } from 'presentational/QuestionHeader';
import { QuestionsCard } from 'presentational/QuestionsCard';
import { EditQuestionCard } from 'presentational/EditQuestionCard';

import {PanelHeader} from 'components';
import SweetAlert from 'react-bootstrap-sweetalert';
import './ImportedQuestions.css';

import { EnableSidebar, DisableSidebar, sidebarTimeout } from '../../../helpers/SidebarLoading';

const importedQuestionsURL = '/api/v1/questions/getQuestions';
const publishURL = '/api/v1/submitQuestionForPublication';
const specialtiesForImportedQuestionsURL = '/api/v1/ImportedQuestions/specialitiesList';
const tagsForImportedQuestionsURL = '/api/v1/importedQuestions/tagsList';


/**
 * ImportedQuestions class component
 * @extends {React}
 */
class ImportedQuestions extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			loadingState: true,
			showQuestions: true,
			isImportedByMe: false,
			userDetail: [],
			importedQuestions: [],
			currentPage: 1,
			isDisabledButton: false,
			searchQuery: '',
			selectedTagsElementToFilterQuestions: null,
			selectedTagsToFilterQuestions: [],
			selectedSpecialtyToFilterQuestions: null,
			totalQuestions: '',
			questionsCount: 0,
			isSearchByText: false,
			isSearchBySpecialty: false,
			selectedQuestionDataEdited: false,
			selectedSourceQuestion: [],
			selectedQuestionData: {
				question: {
					options: [],
				}
			},
			alert: null,
			show: false,
			role: '',
			value: [],
			specialtyList: [],
			comments: [],
			tagsList: []
		};

		// Binding function calling
		this.hideAlert = this.hideAlert.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.makeQuestionListCheck = this.makeQuestionListCheck.bind(this);
		this.chkDiff = this.chkDiff.bind(this);
		this.handleQuestionChange = this.handleQuestionChange.bind(this);
		this.onOptionRadioSelectionChange = this.onOptionRadioSelectionChange.bind(this);
		this.handleOptionTextChange = this.handleOptionTextChange.bind(this);
		this.onTagChange = this.onTagChange.bind(this);
		this.handleExplanationChange = this.handleExplanationChange.bind(this);
		this.handlePubMedChange = this.handlePubMedChange.bind(this);
		this.handleSpecialtyChange = this.handleSpecialtyChange.bind(this);
		this.submitQuestionForPublication = this.submitQuestionForPublication.bind(this);
		this.showQuestions = this.showQuestions.bind(this);
		this.importedByMe = this.importedByMe.bind(this);
		this.changeTag = this.changeTag.bind(this);
		this.clearFilter = this.clearFilter.bind(this);
		this.changeSpecialty = this.changeSpecialty.bind(this);
		this.showQuestionToEditForPublication = this.showQuestionToEditForPublication.bind(this);
		this.submitChangedQuestionForPublication = this.submitChangedQuestionForPublication.bind(this);
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
	 * This will show success alert message
	 * @param {string} msg pass the success alert message
	 */
	successAlert(msg) {
		this.setState({
			alert: (
				<SweetAlert
					success
					style={ {display: 'block', marginTop: '-100px'} }
					title="Success!"
					onConfirm={ this.hideAlert }
					onCancel={ this.hideAlert }
					confirmBtnBsStyle="success"
				>
					{msg}
				</SweetAlert>
			)
		});
	}

	/**
	 * This will fetch the tag list from the database
	 */
	fetchTagList = async ()=> {
		await API.get(`${tagsForImportedQuestionsURL}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// do something
				}
			})
			.then(response => {
				if (response) {
					const mappedTagList = response.data.map(t => ({value: t.id, label: t.tag}));
					this.setState({tagsList: mappedTagList});
				}
			});
	};


	/**
	 * This will fetch the specialty list from the database
	 */
	fetchSpecialty = async () => {
		await API.get(`${specialtiesForImportedQuestionsURL}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// do something
				}
			})
			.then(response => {
				if (response) {
					this.setState({specialtyList: response.data});
				}
			});
	};



	/**
	 * This method will fetch all the verified sourceQuestions from the server
	 */
	fetchImportedQuestions = async () => {
		let userID = JSON.parse(localStorage.getItem('UserInfo')).userID;
		let url;
		if(this.state.isImportedByMe) {
			url = `/api/v1/users/${userID}/questionsImported?page=${this.state.currentPage}`;
		} else {
			url = `${importedQuestionsURL}?page=${this.state.currentPage}`;
		}
		let specialty = '';
		if(this.state.selectedSpecialtyToFilterQuestions) {
			specialty = this.state.selectedSpecialtyToFilterQuestions.label;
		}
		let data = {
			specialty: specialty,
			searchText: this.state.searchQuery,
			tags: this.state.selectedTagsToFilterQuestions
		};
		await API.post(url, data)
			.catch(error => {
				// console.log('BAD', error);
				this.setState({loadingState: false});

				DisableSidebar();

				if (error.response) {
					ErrorRedirect(error.response.status);
				}
			})
			.then(response => {
				if(response && response.data && response.data.data) {
					let nextData = response.data.data;
					this.state.questionsCount = response.data.total;
					this.setState({importedQuestions: this.state.importedQuestions.concat(nextData)});
					this.setState({loadingState: false});
					if(this.state.questionsCount == this.state.importedQuestions.length){
						// show footer
						document.getElementsByClassName('footer')[0].classList.remove('hide-foot');
					}

					setTimeout(() => {
						DisableSidebar();
					}, sidebarTimeout);

				}
			}, this);
	};

	/**
	 * This will make the search as per header search box
	 */
	searchQuestionsFromHeaderSearchField = async () => {
		this.setState({loadingState: true});
		this.state.searchQuery = this.props.searchText;
		this.state.importedQuestions = [];
		this.state.currentPage = 1;

		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchImportedQuestions();
	}

	/**
	 * React lifeCycle hook when component ready
	 */
	componentDidMount() {
		EnableSidebar();

		document.getElementsByClassName('wrapper')[0].classList.add('inif');
		this.props.searchImportedQuestions(this.searchQuestionsFromHeaderSearchField.bind(this)).bind(this);
		// fetch tags
		this.fetchTagList();
		// fetch specialty list
		this.fetchSpecialty();

		this.fetchImportedQuestions();
		// hide footer
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
	}

	/**
	 * React lifeCycle hook when component getting destroy
	 */
	componentWillUnmount() {
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
	 * This will set the single question in the state
	 * @param {Object} item this will set the single current question
	 */
	setCurrentQuestion(item) {
		// console.log(item)
		this.state.selectedSourceQuestion = {
			answer: item.answer,
			options: item.options,
			question: item.question,
			tagsList: item.tagsList,
			allocation: item.allocation,
			explanation: item.explanation,
			pubMedArticle: item.pubMedArticle,
			specialty: item.specialty,
			explanationDoc: item.explanationDoc
		};
		this.state.selectedQuestionData = {
			question: item
		};
		// const {selectedSourceQuestion} = this.state;
		// console.log(selectedSourceQuestion);
	}

	/**
	 * This will show the show question block
	 * @param {*} e this will get the on click event object
	 */
	showQuestionToEditForPublication(e) {
		const item = JSON.parse(e.target.value);
		this.setCurrentQuestion(item);
		this.setState({
			showQuestions: false
		});
	}

	/**
	 * This will change the submit question change
	 * @param {*} event this will get the on click event object
	 */
	submitChangedQuestionForPublication(event) {
		const item = JSON.parse(event.target.value);
		this.setCurrentQuestion(item);
		let e = {
			target: ''
		};
		this.submitQuestionForPublication(e);
	}

	/**
	 * This will revert back to the previous page
	 */
	showQuestions() {
		this.setState({
			showQuestions: true
		});
	}

	/**
	 * This will filtered by me question only
	 */
	importedByMe() {
		this.state.isImportedByMe = !this.state.isImportedByMe;
		this.state.currentPage = 1;
		this.state.importedQuestions = [];
		this.setState({
			showQuestions: true
		});
		this.fetchImportedQuestions();
	}

	/**
	 * This will handle question editable change
	 * @param {*} event this will get the on click event object
	 */
	handleQuestionChange = event => {
		this.state.selectedQuestionData.question.question = event.target.value;
		this.setState({
			showQuestions: false
		});
	};

	/**
	 * this will handle the explanation change
	 * @param {*} event this will get the on click event object
	 */
	handleExplanationChange = event => {
		this.state.selectedQuestionData.question.explanation = event.target.value;
		this.setState({
			showQuestions: false
		});
	}

	/**
	 * This will handle pubMedArticle change
	 * @param {*} event this will get the on click event object
	 */
	handlePubMedChange = event => {
		this.state.selectedQuestionData.question.pubMedArticle = event.target.value;
		this.setState({
			showQuestions: false
		});
	}

	/**
	 * This will handle specialty change
	 * @param {*} event this will get the on click event object
	 */
	handleSpecialtyChange = event => {
		this.state.selectedQuestionData.question.specialty = event.target.value;
		this.setState({
			showQuestions: false
		});
	}


	/**
	 * This will handle options editable change
	 * @param {*} event this will get the on click event object
	 */
	handleOptionTextChange = event => {
		this.state.selectedQuestionData.question.options.map(value => {
			if (value.id == event.target.id) {
				value.option = event.target.value;
			}
		});
		this.state.selectedQuestionDataEdited = true;
		this.setState({
			showQuestions: false
		});
	};

	/**
	 * This will handle options select change
	 * @param {*} event this will get the on click event object
	 */
	onOptionRadioSelectionChange = event => {
		this.state.selectedQuestionData.question.options.map((value) => {
			if (value.id == event.target.id) {
				this.state.selectedQuestionData.question.answer = event.target.value;
			}
		});
		this.setState({
			showQuestions: false
		});
	}

	/**
	 * This will make data save sa per
	 * save for publication or exported for publication
	 * @param {*} event this will get the on click event object
	 */
	submitQuestionForPublication = async event => {
		if (event.target.id == 'save') {
			this.state.selectedQuestionData.isSubmitForPublication = false;
			if (this.state.selectedSourceQuestion.tagsList != this.state.selectedQuestionData.question.tagsList
							|| this.state.selectedSourceQuestion.answer != this.state.selectedQuestionData.question.answer
							|| this.state.selectedSourceQuestion.question != this.state.selectedQuestionData.question.question
							|| this.state.selectedSourceQuestion.options != this.state.selectedQuestionData.question.options
							|| this.state.selectedSourceQuestion.allocation != this.state.selectedQuestionData.question.allocation
							|| this.state.selectedSourceQuestion.explanation != this.state.selectedQuestionData.question.explanation
							|| this.state.selectedSourceQuestion.explanationDoc != this.state.selectedQuestionData.question.explanationDoc
							|| this.state.selectedSourceQuestion.pubMedArticle != this.state.selectedQuestionData.question.pubMedArticle
							|| this.state.selectedSourceQuestion.specialty != this.state.selectedQuestionData.question.specialty) {
				this.state.selectedQuestionDataEdited = true;
				this.state.selectedQuestionData.question.status = 2;
			}
		} else {
			this.state.selectedQuestionData.isSubmitForPublication = true;
			this.state.selectedQuestionData.question.status = 3;
			this.state.selectedQuestionDataEdited = true;
		}

		if(this.state.selectedQuestionDataEdited) {
			this.setState({isDisabledButton: true});
			await API.post(publishURL, this.state.selectedQuestionData)
				.catch(error => {
					// console.log('BAD', error);
					this.state.isDisabledButton = false;
					this.setState({loadingState: false});
					if(error){
						// make something
					}
				}).then(
					response => {
						this.state.isDisabledButton = false;
						if (response) {
							this.successAlert(response.data);
						}
						if(this.state.selectedQuestionData.isSubmitForPublication) {
							let index = this.state.importedQuestions.indexOf(this.state.selectedQuestionData.question);
							this.state.importedQuestions.splice(index, 1);
							this.setState({showQuestions: true});
						} else {
							this.fetchTagList();
						}
					}, this);

			this.state.selectedQuestionDataEdited = false;
		} else {
			this.setState({
				alert: (
					<SweetAlert
						style={ {display: 'block',marginTop: '-100px'} }
						title="Warning!"
						onConfirm={ this.hideAlert }
						showConfirm={ false }
					>
						There is no Change to save.
					</SweetAlert>
				)
			});
			setTimeout(this.hideAlert,2000);
		}
	}

	/**
	 * This will add tags in the array
	 * @param {Object} tags this will get the tags value
	 */
	onTagChange = tags => {
		this.state.selectedQuestionData.question.tagsList = tags;
		this.setState({
			showQuestions: false
		});
	};


	/**
	 * This will clear the filter data
	 */
	clearFilter() {
		this.state.importedQuestions = [];
		this.state.currentPage = 1;
		this.state.searchQuery = '';
		this.state.questionsCount = 0;
		this.state.isImportedByMe = false;
		this.state.selectedTagsToFilterQuestions = [];
		this.setState({selectedSpecialtyToFilterQuestions: null});
		this.setState({selectedTagsElementToFilterQuestions: null});
		// hide footer
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchImportedQuestions();
	}


	/**
	 * This will check the change tag filter
	 * @param {Array} value this pass the array of object
	 */
	changeTag(value) {
		this.state.currentPage = 1;
		this.state.importedQuestions = [];
		this.setState({selectedTagsElementToFilterQuestions: value});
		let selectedTags = [];
		value.map((i) => {
			selectedTags.push(i.label);
		});
		this.state.selectedTagsToFilterQuestions = selectedTags;
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchImportedQuestions();
	}

	/**
	 * This will check the change specialty filter
	 * @param {Object} value this will take the selected specialty value
	 */
	changeSpecialty(value) {
		this.state.currentPage = 1;
		this.state.importedQuestions = [];
		this.state.selectedSpecialtyToFilterQuestions = value;
		this.setState({selectedSpecialtyToFilterQuestions: value});
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchImportedQuestions();
	}

	/**
	 * This will make the fetch the
	 * latest data when user scroll down
	 */
	fetchData = async () => {
		this.state.currentPage = this.state.currentPage + 1;
		this.fetchImportedQuestions();
	};

	/**
	 * This will make comments data for the revision
	 * @param {Array} comments this will be the array of object
	 */
	getComments(comments){
		let data = [];
		comments.map((x) => {
			let val = {
				inverted: true,
				badgeColor: 'danger',
				badgeIcon: '',
				title: 'Revision Suggested by Admin',
				titleColor: 'danger',
				body: (
					<p>{x.comment}</p>
				),
				footerTitle: <p>{x.created_at}</p>
			};
			data.push(val);
		});
		return data;
	}

	/**
	 * This will make difference check div toggle
	 */
	chkDiff(){
		$('#diffCheck').slideToggle();
	}

	/**
	 * @ignore
	 */
	makeQuestionListCheck() {
		// nothing to do right now
	}



	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {
		return (
			<div className="verified-questions">

				{!this.isAuthenticated() ? <Redirect to="/pages"/> : ''}
				{AccessManagement() == 'trainee' ? <Redirect to="/"/> : ''}
				{this.state.alert}

				<PanelHeader size="sm"/>
				<div className="content">
					{this.state.showQuestions == true ? (
						<div className="vQuestionList">
							<Row className="justify-content-center">
								<Col lg={ 12 } md={ 12 } xs={ 12 } className="q-inif">

									{this.state.loadingState == false && (
										<div>
											<QuestionHeader
												importedByMeOn={ true }
												isImportedByMe= { this.state.isImportedByMe }
												importedByMe= { this.importedByMe }
												tagsList= { this.state.tagsList }
												selectedTags= { this.state.selectedTagsElementToFilterQuestions }
												changeTag= { this.changeTag }
												searchFilter= { this.state.searchQuery }
												questionsCount= { this.state.questionsCount }
												selectedSpecialty= { this.state.selectedSpecialtyToFilterQuestions }
												specialtyList= { this.state.specialtyList }
												changeSpecialty= { this.changeSpecialty }
												clearFilter= { this.clearFilter }
											/>
										</div>
									)}

									<InfiniteScroll
										pullDownToRefresh={ false }
										dataLength={ this.state.importedQuestions.length }
										pullDownToRefreshContent={
											<h3 style={ {textAlign: 'center'} }>&#8595; Pull down to refresh</h3>
										}
										releaseToRefreshContent={
											<h3 style={ {textAlign: 'center'} }>&#8593; Release to refresh</h3>
										}
										next={ this.fetchData }
										hasMore={ true }
										endMessage={
											<p style={ {textAlign: 'center'} }>
												<b>Yay! You have seen it all</b>
											</p>
										}
									>

										<QuestionsCard
											questionList= { this.state.importedQuestions }
											makeAnswerChange= { this.makeQuestionListCheck }
											verifiedQuestionArray= ''
											importQuestion= ''
											isImported= { true }
											isSubmitted= { false }
											suggestionsTags= { this.state.tags }
											getComments= { this.getComments }
											disableButton= { this.state.isDisabledButton }
											showQuestionToEditForPublication= { this.showQuestionToEditForPublication }
											submitChangedQuestionForPublication= { this.submitChangedQuestionForPublication }
											suggestedToggle= ''
											rejectToggle= ''
											approveForPublication= ''
										/>

									</InfiniteScroll>

								</Col>
							</Row>
						</div>
					) : (
						<div className="f-single-question">
							<EditQuestionCard
								sourceQuestion= { this.state.selectedQuestionData.question.sourceQuestion }
								selectedSubmittedQuestion= ''
								question= { this.state.selectedQuestionData.question.question }
								questionOptions= { this.state.selectedQuestionData.question.options }
								answer= { this.state.selectedQuestionData.question.answer }
								tagsList= { this.state.selectedQuestionData.question.tagsList }
								suggestionsTags= { this.state.tags }
								explanation= { this.state.selectedQuestionData.question.explanation }
								pubMedArticle= { this.state.selectedQuestionData.question.pubMedArticle }
								specialty= { this.state.selectedQuestionData.question.specialty }
								chkDiff= { this.chkDiff }
								handleQuestionChange= { this.handleQuestionChange }
								onOptionRadioSelectionChange= { this.onOptionRadioSelectionChange }
								handleOptionTextChange= { this.handleOptionTextChange }
								onTagChange= { this.onTagChange }
								handleExplanationChange= { this.handleExplanationChange }
								handlePubMedChange= { this.handlePubMedChange }
								handleSpecialtyChange= { this.handleSpecialtyChange }
								disableButton={ this.state.isDisabledButton }
								submitQuestionForPublication= { this.submitQuestionForPublication }
								showQuestions= { this.showQuestions }
								submittedSection= { false }
								approveForPublication= ''
								publicationSave= ''
							/>
						</div>
					)}

					{this.state.loadingState == true && (
						<Row className="justify-content-center page-loader">
							<h5>
								<strong>
									<i className="fa fa-spinner fa-spin"/>&nbsp;Loading...
								</strong>
							</h5>
						</Row>
					)}
				</div>
			</div>
		);
	}
}

export default ImportedQuestions;
