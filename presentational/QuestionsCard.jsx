import React from 'react';
import {
	Card,
	CardBody,
	FormGroup,
	Label
} from 'reactstrap';
import {Button} from 'components';
import {Motion, spring} from 'react-motion';
import Chips from 'react-chips';
import { Timeline } from 'components';
import {AccessManagement} from '../views/AccessManagement/AccessManagement';


/**
 * This is question card component.
 * This will render the each question as card UI
 * @param {*} props pass the valid props as per example
 * @example
 * <QuestionsCard
 *	 questionList= ''
 *	 makeAnswerChange= ''
 *	 verifiedQuestionArray= ''
 *	 importQuestion= ''
 *	 isImported= { true } // true or false as which area you are using
 *	 isSubmitted= { false } // true or false as which area you are using
 *	 suggestionsTags= ''
 *	 getComments= ''
 *	 disableButton= ''
 *	 showQuestionToEditForPublication= ''
 *	 submitChangedQuestionForPublication= ''
 *	 suggestedToggle= ''
 *	 rejectToggle= ''
 *	 approveForPublication= ''
 * />
 */
export function QuestionsCard(props) {
	return (
		<div>
			{props.questionList.map((item, i) => {
				return(
					<Motion key={ i } style={ {
						x: spring(item.remove ? 0 : 1),
						y: spring(item.remove ? 800 : 0),
						h: spring(item.remove ? 0 : 5000)
					} }
					>
						{value => (<div style={ {
							WebkitTransform: `translate3d(${value.y}px, 0, 0)`,
							transform: `translate3d(${value.y}px, 0, 0)`,
							opacity: `${value.x}`,
							maxHeight: `${value.h}px`
						} }>
							<div key={ i } className={ 'questions-wrap v-questions-wrap q-animate-' + i }>
								<Card>
									<CardBody>
										<div className="row">
											<div className="col-sm-12 col-md-12 col-lg-12 right-panel">
												<span className="badge badge-info">{item.specialty}</span>

												{item.status == 3 && <span className="badge badge-info status-info">Submitted</span>}
												{item.status == 4 && <span className="badge badge-info status-info published">Published</span>}

												<h5>{item.question}</h5>
												<div className="row">
													<div className="col-sm-12 col-md-12">

														{item.options.map((option, i) => (
															<div key={ i }>
																<FormGroup check className="form-check-radio">
																	<Label check>
																		<input type="radio"
																			id={ option.id }
																			checked={ parseInt(item.answer) == option.id }
																			onChange={ props.makeAnswerChange }
																			className="form-check-input"
																		/>
																		<span className="form-check-sign"></span>
																		{option.option}
																	</Label>
																</FormGroup>
															</div>
														))}

														{ props.isImported === false &&
															<div>
																{item.explanationDoc.length > 0 && (
																	<a
																		href={ item.explanationDoc }
																		className="expDoc"
																		target="_blank"
																	>
																		<i className="fa fa-link"/>
																	Explanation Documentation
																	</a>
																)}
															</div>
														}

														{ props.isImported === true &&
															<div>
																<div className="question-tags">
																	<Chips
																		placeholder=""
																		value={ item.tagsList }
																		suggestions={ props.suggestionsTags }
																	/>
																</div>

																<div>
																	{item.comments.length > 0 &&
																		(<Card className="card-plain card-timeline">
																			<CardBody>
																				{ props.isSubmitted === false &&
																					<Timeline stories={ props.getComments(item.comments) } simple/>
																				}
																			</CardBody>
																		</Card>)
																	}
																</div>
															</div>
														}


														<div className="text-right top-inner">

															{ props.isImported === false &&
																<Button
																	color="primary"
																	className="import-btn"
																	value={ JSON.stringify(item) }
																	disabled={ props.verifiedQuestionArray == 0 }
																	onClick={ props.importQuestion }
																	round
																>
																	Import
																</Button>
															}

															{ props.isImported === true && props.isSubmitted === false &&
																<div>
																	<Button
																		color="primary"
																		disabled={ props.disableButton }
																		className="publish-btn"
																		value={ JSON.stringify(item) }
																		onClick={ props.showQuestionToEditForPublication }
																		round
																	>
																		Edit
																	</Button>

																	{item.status == 2 &&
																		<Button
																			color="primary"
																			disabled={ props.disableButton }
																			className="publish-btn"
																			value={ JSON.stringify(item) }
																			onClick={ props.submitChangedQuestionForPublication }
																			round
																		>
																				Submit for Publication
																		</Button>
																	}
																</div>
															}


															{ props.isImported === true && props.isSubmitted === true &&
																<div>
																	{ item.status == 3 && AccessManagement() == 'admin' &&
																		<div className="text-left">
																			<Button
																				color="primary"
																				className="publish-btn"
																				id={ item.id }
																				onClick={ props.rejectToggle }
																				round
																			>
																				Reject
																			</Button>

																			<Button
																				color="primary"
																				className="publish-btn"
																				id={ item.id }
																				onClick={ props.suggestedToggle }
																				round
																			>
																				Suggest Revision
																			</Button>

																			<Button
																				color="primary"
																				className="publish-btn"
																				disabled={ props.isDisabledButton }
																				value={ JSON.stringify(item) }
																				onClick={ props.showQuestionToEditForPublication }
																				round
																			>
																				Edit
																			</Button>

																			<Button
																				color="primary"
																				className="publish-btn"
																				value={ JSON.stringify(item) }
																				onClick={ props.approveForPublication }
																				round
																			>
																				Publish
																			</Button>
																		</div>
																	}
																</div>
															}


														</div>
													</div>
												</div>

											</div>
										</div>
									</CardBody>
								</Card>
							</div>
						</div>)}
					</Motion>
				);
			})}
		</div>
	);
}