import React from 'react';
import {
	Card,
	CardBody,
	FormGroup,
	Label
} from 'reactstrap';
import Select from 'react-select';
import {Button} from 'components';


/**
 * This is question card header section filter component.
 * This will responsible for rendering the filter section
 * @param {*} props pass the valid props as per example
 * @example
 * <QuestionHeader
 *	 importedByMeOn={ true } // true or false as which area you are using
 *	 isImportedByMe= ''
 *	 importedByMe= ''
 *	 tagsList= ''
 *	 selectedTags= ''
 *	 changeTag= ''
 *	 searchFilter= ''
 *	 questionsCount= ''
 *	 selectedSpecialty= ''
 *	 specialtyList= ''
 *	 changeSpecialty= ''
 *	 clearFilter= ''
 *	/>
 */
export function QuestionHeader(props) {
	return (
		<Card className="top-btn-grp">
			{props.searchFilter != ''  &&
				<div className="searches text-right">
					<span>Showing <strong>{props.questionsCount}</strong> Results for <strong>"{props.searchFilter}"</strong></span>
				</div>
			}
			<CardBody>
				<div className="row">
					<div className="col-sm-12 col-md-12 col-xl-3">
						{props.importedByMeOn === true &&
							<FormGroup check className="import-top-chk">
								<Label check>
									<input
										type="checkbox"
										checked={ props.isImportedByMe }
										onChange={ props.importedByMe }
									/>
									<span className="form-check-sign"/>
										Imported by me
								</Label>
							</FormGroup>
						}
					</div>
					<div className="col-sm-12 col-md-12 col-xl-9">
						<div className="row filterQuestionWrap m-bt-10">
							<div className="col-sm-12 col-md-5 xs-mb-15">
								{props.tagsList !== '' &&
									<Select
										className="warning"
										multi={ true }
										closeOnSelect={ false }
										placeholder="Filter by tags"
										name="selectedTagsElementToFilterQuestions"
										options= { props.tagsList }
										value= { props.selectedTags }
										onChange={ props.changeTag }
									/>
								}
							</div>
							<div className="col-sm-12 col-md-4 xs-mb-15">
								<Select
									className="primary"
									placeholder="Filter by specialty"
									name="singleSelect"
									value={ props.selectedSpecialty }
									options={ props.specialtyList }
									onChange={ props.changeSpecialty }
								/>
							</div>
							<div className="col-sm-12 col-md-3 filter-btn-grp">
								<Button
									onClick={ props.clearFilter }
									round
									className="bigFilterClear"
									color="primary"
								>Clear Filter</Button>
							</div>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}