// @flow
import React from 'react';
import {Redirect} from 'react-router-dom';

import {API} from '../../../physician_life_api/api';
import {AccessManagement} from '../../AccessManagement/AccessManagement';
import {ErrorRedirect} from '../../../helpers/ErrorRedirect';

import InfiniteScroll from 'react-infinite-scroll-component';

import { EnableSidebar, DisableSidebar, sidebarTimeout } from '../../../helpers/SidebarLoading';

import {
	Row,
	Col,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap';

import { QuestionHeader } from 'presentational/QuestionHeader';
import { QuestionsCard } from 'presentational/QuestionsCard';
import { EditQuestionCard } from 'presentational/EditQuestionCard';

import {PanelHeader} from 'components';
import {Button} from 'components';
import SweetAlert from 'react-bootstrap-sweetalert';

import './SubmittedQuestions.css';

// api url constant
const publishQuestionURL = '/api/v1/publish';
const submittedOrPublishedQuestionsURL = '/api/v1/questions/getQuestions';
const tagsForSubmittedAndPublishedURL = '/api/v1/submittedAndPublishedQuestions/tagsList';
const specialtiesForSubmittedAndPublishedURL = '/api/v1/submittedAndPublishedQuestions/specialitiesList';
const publishURL = '/api/v1/submitQuestionForPublication';
const rejectUrl = '/api/v1/rejectQuestion';
const suggestUrl = '/api/v1/suggestQuestionForRevision';

/**
 * SubmittedQuestions class component
 * @extends {React}
 */
class SubmittedQuestions extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			loadingState: true,
			isSubmittedByMe: false,
			submittedQuestions: [],
			alert: null,
			multipleSelectTag: null,
			specialtyList: [],
			specialtySelect: null,
			searchQuery: '',
			selectedTagsElementToFilterQuestions: null,
			selectedTagsToFilterQuestions: [],
			selectedSpecialtyToFilterQuestions: null,
			currentPage: 1,
			questionsCount: 0,
			isSearchBySpecialty: false,
			specialtyData:{},
			isSearchByTags: false,
			tagsData: [],
			suggestedModal: false,
			rejectedModal: false,
			isDisabledButton: false,
			showQuestions: true,
			selectedQuestionDataEdited: false,
			selectedSourceQuestion: [],
			selectedQuestionData: {
				question: {
					options: [],
				}
			},
			suggestedId: '',
			suggestedText: '',
			rejectId: '',
			rejectText: '',
			popupStateOpen: true,
			backdrop: 'static'
		};

		// Binding function calling
		this.hideAlert = this.hideAlert.bind(this);
		this.successAlert = this.successAlert.bind(this);
		this.suggestedToggle = this.suggestedToggle.bind(this);
		this.rejectToggle = this.rejectToggle.bind(this);
		this.suggestedChange = this.suggestedChange.bind(this);
		this.suggestedSubmit = this.suggestedSubmit.bind(this);
		this.rejectChange = this.rejectChange.bind(this);
		this.rejectedSubmit = this.rejectedSubmit.bind(this);
		this.onOptionRadioSelectionChange = this.onOptionRadioSelectionChange.bind(this);
		this.handleOptionTextChange = this.handleOptionTextChange.bind(this);
		this.onTagChange = this.onTagChange.bind(this);
		this.handleExplanationChange = this.handleExplanationChange.bind(this);
		this.saveQuestion = this.saveQuestion.bind(this);
		this.handlePubMedChange = this.handlePubMedChange.bind(this);
		this.handleSpecialtyChange = this.handleSpecialtyChange.bind(this);
		this.showQuestions = this.showQuestions.bind(this);
		this.makeCheckChange = this.makeCheckChange.bind(this);
		this.clearFilter = this.clearFilter.bind(this);
		this.changeSpecialty = this.changeSpecialty.bind(this);
		this.changeTag = this.changeTag.bind(this);
		this.approveForPublication = this.approveForPublication.bind(this);
		this.showQuestionToEditForPublication = this.showQuestionToEditForPublication.bind(this);
	}


	/**
	 * This will make the suggested popup toggle
	 * @param {number} e this will take the id
	 */
	suggestedToggle(e) {
		// console.log(e.target.id);
		this.setState({
			popupStateOpen: !this.state.popupStateOpen
		});
		let id = e.target.id;

		// console.log(id)
		this.setState({
			suggestedModal: !this.state.suggestedModal
		});

		setTimeout(()=>{
			const {suggestedModal} = this.state;

			if(suggestedModal){
				this.setState({suggestedId: id});
			} else {
				this.setState({suggestedId: ''});
				this.setState({suggestedText: ''});
			}
		},500);
	}


	/**
	 * This will make the regected popup toggle
	 * @param {number} e this will take the id
	 */
	rejectToggle(e) {
		this.setState({
			popupStateOpen: !this.state.popupStateOpen
		});
		// alert()
		// console.log(e.target.id);
		let id = e.target.id;
		this.setState({
			rejectedModal: !this.state.rejectedModal
		});


		setTimeout(()=>{
			const {rejectedModal} = this.state;

			if(rejectedModal){
				this.setState({rejectId: id});
			} else {
				this.setState({rejectId: ''});
				this.setState({rejectText: ''});
			}
		},500);
	}


	/**
	 * This will make suggested form submit
	 */
	suggestedSubmit() {
		const localObj = {
			question_id: this.state.suggestedId,
			comment: this.state.suggestedText
		};

		this.setState({
			popupStateOpen: true
		});

		this.suggestedRejected(suggestUrl, localObj);
	}


	/**
	 * This will make rejected form submit
	 */
	rejectedSubmit() {
		const localObj = {
			question_id: this.state.rejectId,
			comment: this.state.rejectText
		};

		this.setState({
			popupStateOpen: true
		});

		this.suggestedRejected(rejectUrl, localObj);
	}


	/**
	 * This will call the api and save the data
	 * for the suggested and rejected form
	 */
	suggestedRejected = async (url, data) => {
		this.setState({isDisabledButton:true});
		await API.post(url, data)
			.catch(error => {
				// console.log('BAD', error);
				if (error.response) {
					ErrorRedirect(error.response.status);
				}
			})
			.then(response => {
				if (response) {
					if(response.status == 200){

						// removing from array
						let submittedQuestionsArr = this.state.submittedQuestions;
						let filteredArr = submittedQuestionsArr.filter(function(el) {
							return el.id !== data.question_id*1;
						});

						this.setState({submittedQuestions: filteredArr});
						// removing from array
						this.setState({
							suggestedModal: false
						});
						this.setState({
							rejectedModal: false
						});

						this.setState({rejectId: ''});
						this.setState({rejectText: ''});
						this.setState({suggestedId: ''});
						this.setState({suggestedText: ''});
						this.setState({isDisabledButton:false});
					}
				}
			});
	};


	/**
	 * Suggested value changes value bind with the state
	 * @param {*} e on change event object
	 */
	suggestedChange(e){
		this.setState({suggestedText: e.target.value});
	}


	/**
	 * Rejected value changes value bind with the state
	 * @param {*} e on change event object
	 */
	rejectChange(e){
		this.setState({rejectText: e.target.value});
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
	 * This method will fetch all the
	 * verified sourceQuestions from the server
	 */
	fetchSubmittedQuestions = async () => {
		let userID = JSON.parse(localStorage.getItem('UserInfo')).userID;
		let url = '';

		if(AccessManagement() == 'admin') {
			url = `${submittedOrPublishedQuestionsURL}?page=${this.state.currentPage}`;
		} else {
			url = `/api/v1/users/${userID}/questionsSubmitted?page=${this.state.currentPage}`;
		}

		let specialty = '';
		if(this.state.selectedSpecialtyToFilterQuestions) {
			specialty = this.state.selectedSpecialtyToFilterQuestions.label;
		}
		let data = {
			isSubmitted: true,
			specialty: specialty,
			searchText: this.state.searchQuery,
			tags: this.state.selectedTagsToFilterQuestions
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
					this.setState({submittedQuestions: this.state.submittedQuestions.concat(nextData)});
					this.setState({loadingState: false});
					if(this.state.questionsCount == this.state.submittedQuestions.length){
						// show footer
						document.getElementsByClassName('footer')[0].classList.remove('hide-foot');
					}

					this.setState({});

					setTimeout(() => {
						DisableSidebar();
					}, sidebarTimeout);

				}
			});
	};

	/**
	 * This will filtered by me question only
	 */
	importedByMe() {
		this.state.isImportedByMe = !this.state.isImportedByMe;
		this.state.currentPage = 1;
		this.state.submittedQuestions = [];
		this.setState({loadingState: false});

		this.fetchSubmittedQuestions();
	}


	/**
	 * This will publish the question
	 * @param {*} e on click event object
	 */
	approveForPublication = async e => {

		const item = JSON.parse(e.target.value);

		this.setState({loadingState: true});
		await API.get(`${publishQuestionURL}/${item.id}`)
			.catch(error => {
				this.setState({loadingState: false});
				if (error.response) {
					ErrorRedirect(error.response.status);
				}
			})
			.then(response => {
				this.state.currentPage = 1;
				this.state.submittedQuestions = [];
				this.setState({loadingState: false});
				this.successAlert(response.data);
				this.fetchSubmittedQuestions();
			});
	}

	/**
	 * This will make the search as per header search box
	 */
	searchQuestionsFromHeaderSearchField = async () => {
		this.setState({loadingState: true});
		this.state.searchQuery = this.props.searchText;
		this.state.submittedQuestions = [];
		this.state.currentPage = 1;

		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchSubmittedQuestions();
	}




	/**
	 * This method will fetch the tag list
	 */
	fetchTagList = async () => {
		await API.get(`${tagsForSubmittedAndPublishedURL}`)
			.catch(error => {
				// console.log('BAD', error);
				if(error){
					// make something
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
	 * This method will fetch the specialty list
	 */
	fetchSpecialty = async () => {
		await API.get(`${specialtiesForSubmittedAndPublishedURL}`)
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
	 * React lifeCycle hook when component ready
	 */
	componentDidMount() {
		EnableSidebar();

		document.getElementsByClassName('wrapper')[0].classList.add('inif');
		this.props.searchSubmittedQuestions(this.searchQuestionsFromHeaderSearchField.bind(this)).bind(this);
		// fetch tags
		this.fetchTagList();
		// fetch specialty list
		this.fetchSpecialty();

		// get verified sourceQuestions
		this.fetchSubmittedQuestions();
		// hide footer
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
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
	 * This will clear the filter data
	 */
	clearFilter() {
		this.state.submittedQuestions = [];
		this.state.currentPage = 1;
		this.state.searchQuery = '';
		this.state.questionsCount = 0;
		this.state.selectedTagsToFilterQuestions = [];
		this.state.selectedSpecialtyToFilterQuestions = null;
		this.setState({selectedTagsElementToFilterQuestions: null});
		// hide footer
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchSubmittedQuestions();
	}


	/**
	 * This will check the change tag filter
	 * @param {Array} value this pass the array of object
	 */
	changeTag(value) {
		this.state.currentPage = 1;
		this.state.submittedQuestions = [];
		this.setState({selectedTagsElementToFilterQuestions: value});
		let selectedTags = [];
		value.map((i) => {
			selectedTags.push(i.label);
		});
		this.state.selectedTagsToFilterQuestions = selectedTags;
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchSubmittedQuestions();
	}


	/**
	 * This will check the change specialty filter
	 * @param {Object} value this will take the selected specialty value
	 */
	changeSpecialty(value) {
		this.state.currentPage = 1;
		this.state.submittedQuestions = [];
		this.state.selectedSpecialtyToFilterQuestions = value;
		this.setState({selectedSpecialtyToFilterQuestions: value});
		document.getElementsByClassName('footer')[0].classList.add('hide-foot');
		this.fetchSubmittedQuestions();
	}

	/**
	 * This will make the fetch the
	 * latest data when user scroll down
	 */
	fetchData = async () => {
		this.state.currentPage = this.state.currentPage + 1;
		this.fetchSubmittedQuestions();
	};




	/**
	 * This will revert back to the previous page
	 */
	showQuestions() {
		this.setState({
			showQuestions: true
		});
	}



	/**
	 * This will set the current question in the selected source question
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
			explanationDoc: item.explanationDoc,
			id: item.id
		};
		this.state.selectedQuestionData = {
			question: item
		};

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
	 * This will save question for admin
	 */
	saveQuestion = async () => {
		if (
			this.state.selectedSourceQuestion.tagsList != this.state.selectedQuestionData.question.tagsList
					|| this.state.selectedSourceQuestion.answer != this.state.selectedQuestionData.question.answer
					|| this.state.selectedSourceQuestion.question != this.state.selectedQuestionData.question.question
					|| this.state.selectedSourceQuestion.options != this.state.selectedQuestionData.question.options
					|| this.state.selectedSourceQuestion.explanation != this.state.selectedQuestionData.question.explanation
					|| this.state.selectedSourceQuestion.pubMedArticle != this.state.selectedQuestionData.question.pubMedArticle
					|| this.state.selectedSourceQuestion.specialty != this.state.selectedQuestionData.question.specialty
		) {
			this.state.selectedQuestionDataEdited = true;
			this.state.selectedQuestionData.question.status = 3;
		}

		//  main move
		if(this.state.selectedQuestionDataEdited) {
			this.setState({isDisabledButton: true});
			await API.post(publishURL, this.state.selectedQuestionData)
				.catch(error => {
					// console.log('BAD', error);
					if(error){
						// make something
					}
					this.state.isDisabledButton = false;
					this.setState({loadingState: false});
				}).then(
					response => {
						this.state.isDisabledButton = false;
						if (response) {
							this.successAlert(response.data);
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
	 * @ignore
	 */
	makeCheckChange(){
		// nothing to do right now
	}


	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {

		// suggested modal
		const suggestedModalCont = (
			<Modal isOpen={ this.state.suggestedModal } toggle={ this.suggestedToggle } backdrop={ this.state.backdrop } className={ `blue-cross-modal ${this.state.popupStateOpen}` }>
				<ModalHeader toggle={ this.suggestedToggle }>Suggest Revision</ModalHeader>
				<ModalBody>
					<Input
						type="textarea"
						name="revision"
						style={ { height: 150, maxHeight: 'none' } }
						placeholder= "Type your suggestion"
						value={ this.state.suggestedText }
						onChange={ this.suggestedChange }
					/>
				</ModalBody>
				<ModalFooter>
					<Button
						round
						color="primary"
						onClick={ this.suggestedSubmit }
						disabled={ !this.state.suggestedText }
					>Submit</Button>{' '}
					<Button round color="secondary" disabled={ this.state.popupStateOpen } onClick={ this.suggestedToggle }>Cancel</Button>
				</ModalFooter>
			</Modal>
		);


		// reject modal
		const rejectModalCont = (
			<Modal isOpen={ this.state.rejectedModal } toggle={ this.rejectToggle } backdrop={ this.state.backdrop } className={ `blue-cross-modal ${this.state.popupStateOpen}` }>
				<ModalHeader toggle={ this.rejectToggle }>Reject</ModalHeader>
				<ModalBody>
					<Input
						type="textarea"
						name="revision"
						style={ { height: 150, maxHeight: 'none' } }
						placeholder= "Type your comment"
						value={ this.state.rejectText }
						onChange={ this.rejectChange }
					/>
				</ModalBody>
				<ModalFooter>
					<Button
						round
						color="primary"
						onClick={ this.rejectedSubmit }
						disabled={ !this.state.rejectText }
					>Submit</Button>{' '}
					<Button round color="secondary" onClick={ this.rejectToggle }>Cancel</Button>
				</ModalFooter>
			</Modal>
		);


		return (
			<div className="verified-questions">

				{suggestedModalCont}
				{rejectModalCont}

				{!this.isAuthenticated() ? <Redirect to="/pages"/> : ''}
				{AccessManagement() == 'trainee' ? <Redirect to="/"/> : ''}
				{this.state.alert}

				<PanelHeader size="sm"/>
				<div className="content">

					{this.state.showQuestions == true ? (
						<div className="vQuestionList">
							<Row className="justify-content-center">
								<Col lg={ 12 } md={ 12 } xs={ 12 }>

									{this.state.loadingState == false && (
										<div>
											<QuestionHeader
												importedByMeOn={ false }
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
										dataLength={ this.state.submittedQuestions.length } //This is important field to render the next data
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
											questionList= { this.state.submittedQuestions }
											makeAnswerChange= { this.makeCheckChange }
											verifiedQuestionArray= ''
											importQuestion= ''
											isImported= { true }
											isSubmitted= { true }
											suggestionsTags= { this.state.tags }
											getComments= ''
											disableButton= { this.state.isDisabledButton }
											showQuestionToEditForPublication= { this.showQuestionToEditForPublication }
											submitChangedQuestionForPublication= ''
											suggestedToggle= { this.suggestedToggle }
											rejectToggle= { this.rejectToggle }
											approveForPublication= { this.approveForPublication }
										/>
									</InfiniteScroll>


								</Col>
							</Row>

						</div>
					) : (
						<div className="f-single-question">
							<EditQuestionCard
								sourceQuestion= { this.state.selectedQuestionData.question.sourceQuestion }
								selectedSubmittedQuestion= { this.state.selectedQuestionData.question }
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
								submittedSection= { true }
								approveForPublication= { this.approveForPublication }
								publicationSave= { this.saveQuestion }
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

export default SubmittedQuestions;
