import React from 'react';
import {
	Card,
	CardBody,
	FormGroup,
	Label,
	Row,
	Col,
	Input
} from 'reactstrap';
import {Button} from 'components';
import Diff from 'react-diffy';
import Chips from 'react-chips';



/**
 * This is question edit card component.
 * This will render the edited question card
 * @param {*} props pass the valid props as per example
 * @example
 * <EditQuestionCard
 *	 sourceQuestion= ''
 *	 selectedSubmittedQuestion= ''
 *	 question= ''
 *	 questionOptions= ''
 *	 answer= ''
 *	 tagsList= ''
 *	 suggestionsTags= ''
 *	 explanation= ''
 *	 pubMedArticle= ''
 *	 specialty= ''
 *	 chkDiff= ''
 *	 handleQuestionChange= ''
 *	 onOptionRadioSelectionChange= ''
 *   handleOptionTextChange= ''
 *	 onTagChange= ''
 *	 handleExplanationChange= ''
 *	 handlePubMedChange= ''
 *	 handleSpecialtyChange= ''
 *	 disableButton=''
 *	 submitQuestionForPublication= ''
 *	 showQuestions= ''
 *	 submittedSection= { false } // true or false as which area you are using
 *	 approveForPublication= ''
 *   publicationSave= ''
 * />
 */
export function EditQuestionCard(props) {
	return (
		<Card className="edit-question-wrap">
			<Row className="justify-content-center parent-question">
				<Col lg={ 12 } md={ 12 } xs={ 12 }>
					<CardBody>
						<div className="form-group">
							<label className="form-control-label" style={ {width: '100%'} }>
									Edit Question
								{ ' ' }
								{ props.question !== props.sourceQuestion &&
											<a href="javascript:void(0);" style={ {float: 'right'} } onClick={ props.chkDiff }>
													Check question difference
											</a>
								}
							</label>

							<Input
								type="textarea"
								className="form-input form-inp-textarea"
								placeholder="Question"
								value={ props.question }
								onChange={ props.handleQuestionChange }
								name="edit-question"
							/>
						</div>

						<div id="diffCheck" style={ {display: 'none'} }>
							<Diff
								inputA={ props.sourceQuestion }
								inputB={ props.question }
								type="words"
							/>
						</div>



						<div className="form-group-opt">
							<label className="form-control-label">Edit Options</label>
						</div>
						{
							props.questionOptions.map((item, i) => (
								<div key={ i } className={ 'option-list opt-' + i }>
									<FormGroup check className="form-check-radio">
										<div className="options-wrap">
											<div className="left-radio">
												<Label check>
													<input
														type="radio"
														name="radios"
														id={ item.id }
														checked={ item.id == props.answer }
														value={ item.id }
														onChange={ props.onOptionRadioSelectionChange }
													/>
													<span className="form-check-sign"/>
												</Label>
											</div>
											<div className="right-inp">
												<Input
													type="text"
													id={ item.id }
													placeholder="Option"
													className="form-input"
													value={ item.option }
													onChange={ props.handleOptionTextChange }
												/>
											</div>
										</div>
									</FormGroup>
								</div>
							))
						}

						<div className="question-tags">
							<label className="form-control-label">Edit Tags</label>
							<Chips
								placeholder="Add a tags"
								value={ props.tagsList }
								onChange={ props.onTagChange }
								suggestions={ props.suggestionsTags }
							/>
						</div>

						<div className="form-group">
							<label className="form-control-label">Edit Explanation</label>
							<Input
								type="textarea"
								className="form-input form-inp-textarea"
								placeholder="Explanation"
								onChange={ props.handleExplanationChange }
								value={
									props.explanation == null
										? ''
										: props.explanation
								}
							/>
						</div>


						<div className="form-group">
							<label className="form-control-label">Edit PubMed Article</label>
							<Input
								type="text"
								className="form-input"
								placeholder="PubMed Article"
								onChange={ props.handlePubMedChange }
								value={
									props.pubMedArticle == null
										? ''
										: props.pubMedArticle
								}
							/>
						</div>

						<div className="form-group">
							<label className="form-control-label">Edit Specialty</label>
							<Input
								type="text"
								className="form-input"
								placeholder="Specialty"
								onChange={ props.handleSpecialtyChange }
								value={
									props.specialty == null
										? ''
										: props.specialty
								}
							/>
						</div>


						<div className="row">
							<div className="col-sm text-left">
								<Button
									color="primary"
									disabled={ props.isDisabledButton }
									id="submit"
									value={ JSON.stringify(props.selectedSubmittedQuestion) }
									onClick={
										props.submittedSection === false ?
											props.submitQuestionForPublication
											:
											props.approveForPublication
									}
									round
								>
										Submit For Publication
								</Button>
							</div>
							<div className="col-sm text-left">
								<Button
									color="primary"
									disabled={ props.isDisabledButton }
									id="save"
									onClick={
										props.submittedSection === false ?
											props.submitQuestionForPublication
											:
											props.publicationSave
									}
									round
								>
										Save Changes
								</Button>
							</div>
							<div className="col-sm text-right">
								<Button
									color="primary"
									disabled={ props.isDisabledButton }
									onClick={ props.showQuestions }
									round
								>
										Back
								</Button>
							</div>
						</div>
					</CardBody>
				</Col>
			</Row>
		</Card>
	);
}
