import React from 'react';
import {
	FormGroup,
	Label
} from 'reactstrap';
import {
	Accordion,
	AccordionItem,
	AccordionItemTitle,
	AccordionItemBody,
} from 'react-accessible-accordion';


/**
 * This is clinical do case list.
 * This will render the full accordion item
 * @param {*} props pass the valid props as per example
 * @example
 * <ClinicalDoCaseChecklist
 *	 doCaseList={ <Array of object> } // required array of object
 *   handleChangeChk={ <Method> } // on change method for getting checkbox data
 *	/>
 */
export function ClinicalDoCaseChecklist(props) {
	return (
		<Accordion>
			{props.doCaseList.data.map((doCase, i) => {
				return(
					<AccordionItem key={ i }>
						<AccordionItemTitle>
							<h3 className="u-position-relative">
								{doCase.title}
								<div className="roundAccordionArrow">
									<div className="accordion__arrow" role="presentation" />
								</div>
							</h3>
						</AccordionItemTitle>
						<AccordionItemBody>
							{doCase.list.map((list, j) => {
								return(
									<div key={ j }>
										{list.short !== 'All' &&
											<h3 className="short-list">{ list.short }</h3>
										}
										<ul className="do-check-list">
											{list.items.map((checkList, j) => {
												return(
													<li key={ j }>
														{checkList.findings.length <= 0 ?
															<div>
																<FormGroup check className="form-check">
																	<Label check>
																		<input type="checkbox"
																			id={ checkList.items_map_id }
																			value="item"
																			onChange={ props.handleChangeChk }
																			className="form-check-input"
																		/>
																		<span className="form-check-sign"></span>
																		{ checkList.item }
																	</Label>
																</FormGroup>
															</div>
															:
															<ul className="has-finding">
																{checkList.findings.map((f, k) => {
																	return(
																		<li className="finding-item" key={ k }>
																			<div>
																				<FormGroup check className="form-check">
																					<Label check>
																						<input type="checkbox"
																							id={ f.id }
																							value="finding"
																							onChange={ props.handleChangeChk }
																							className="form-check-input"
																						/>
																						<span className="form-check-sign"></span>
																						{ f.finding }
																					</Label>
																				</FormGroup>
																			</div>
																		</li>
																	);
																})}
															</ul>
														}
													</li>
												);
											})}
										</ul>
									</div>
								);
							})}
						</AccordionItemBody>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}