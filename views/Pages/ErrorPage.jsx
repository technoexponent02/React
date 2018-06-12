import React from 'react';
import { Link } from 'react-router-dom';
import {
	Container,
	Col,
} from 'reactstrap';

import { Button } from 'components';

// import avatar from 'assets/img/eva.jpg';

import bgImage from 'assets/img/bg13.jpg';

import { API } from '../../physician_life_api/api';

const url = '/api/v1/sendMailAdmin';

class ErrorPage extends React.Component {
		sendMail = async mailData => {
			await API.post(url, mailData)
				.catch(error => {
					// console.log('BAD', error);
					if(error){
						// make something`
					}
				})
				.then(response => {
					if (response) {
						// console.log('GOOD', response);
					}
				});
		};

		componentDidMount() {
			// get error report
			if (sessionStorage.getItem('ErrorReport') != null) {
				const errorReportData = JSON.parse(sessionStorage.getItem('ErrorReport'));

				const localData = {
					subject: 'User getting error response from server',
					message: `DB disconnected for user ${errorReportData.email} at ${
						errorReportData.time
					} & ${errorReportData.date} trying to load page "${
						errorReportData.url
					}"`
				};
				// console.log(localData)

				this.sendMail(localData);
			}
		}

		render() {
			return (
				<div>
					<div className="full-page-content full-err-page">
						<div className="lock-page">
							<Container>
								<Col lg={ 8 } md={ 8 } xs={ 12 } className="mr-auto ml-auto">
									<div className="errorPage">
										<i className="fa fa-exclamation-triangle" />
										<h2>Something went wrong!</h2>
										<Link to="/">
											<Button color="primary" round type="button">
												Back To Home Page
											</Button>
										</Link>
									</div>
								</Col>
							</Container>
						</div>
					</div>
					<div
						className="full-page-background"
						style={ { backgroundImage: 'url(' + bgImage + ')' } }
					/>
				</div>
			);
		}
}

export default ErrorPage;
