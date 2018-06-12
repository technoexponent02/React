import React from 'react';
// javascript plugin used to create scrollbars on windows
import {
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import { Header, Footer, Sidebar } from 'components';
import dashboardRoutes from 'routes/dashboard.jsx';
import userPage from '../../routes/userPage.jsx';


/**
 * Dashboard class component
 * @extends {React}
 */
class Dashboard extends React.Component {
	/** @constructor */
	constructor(props) {
		super(props);
		// Component state
		this.state = {
			searchText: ''
		};

		// Binding function calling
		this.clearSearch = this.clearSearch.bind(this);
		this.onSearchTextChange = this.onSearchTextChange.bind(this);
		this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
	}

	/**
	 * React lifeCycle hook when component ready
	 */
	componentDidMount() {
		if (navigator.platform.indexOf('Win') > -1) {
			// ps = new PerfectScroll bar(this.refs.mainPanel);
		}
	}

	/**
	 * React lifeCycle hook when component getting destroy
	 */
	componentWillUnmount() {
		if (navigator.platform.indexOf('Win') > -1) {
			// ps.destroy();
		}
	}

	/**
	 * This will get the value on change search text box
	 * @param {*} event this will get the on change event object
	 */
	onSearchTextChange = event => {
		this.setState({
			searchText: event.target.value
		});
	}

	/**
	 * On enter button press this will trigger the search icon click
	 * @param {*} event this will get the on click event object
	 */
	handleEnterPress = event => {
		event.preventDefault();
		if (event.charCode == 13) {
			if (this.props.history.location.pathname === '/source-questions') {
				this.clickSearchIconOnHeader();
			}
		} else {
			this.setState({
				searchText: event.target.value
			});
		}
	}

	/**
	 * On search click this will emit the search event
	 * @param {*} event this will get the on click event object
	 */
	onSearchButtonClick = event => {
		event.preventDefault();
		if (this.props.history.location.pathname === '/source-questions') {
			this.searchSourceQuestions();
		} else if (this.props.history.location.pathname === '/imported-questions') {
			this.searchImportedQuestions();
		} else if (this.props.history.location.pathname === '/submitted-questions') {
			this.searchSubmittedQuestions();
		}
		this.clearSearch();
	}

	/**
	 * This will clear the search input box text
	 */
	clearSearch() {
		this.setState({
			searchText: ''
		});
	}

	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render() {
		return (
			<div className="wrapper">
				<Sidebar { ...this.props } routes={ dashboardRoutes } userRoutes={ userPage } />
				<div className="main-panel" ref="mainPanel">
					<Header
						onSearchTextChange={ this.onSearchTextChange }
						onSearchButtonClick={ this.onSearchButtonClick }
						searchText={ this.state.searchText } { ...this.props }
					/>
					<Switch>
						{
							dashboardRoutes.map((prop, key) => {
								if (prop.collapse) {
									return prop.views.map((prop2, key2) => {
										if (prop2.name === 'Source Questions') {
											return (
												<Route path={ prop2.path } exact
													render={ (props) => (
														<prop2.component
															searchText={ this.state.searchText }
															searchSourceQuestions={ click => this.searchSourceQuestions = click } { ...props }
														/>) }
												/>
											);
										} else if (prop2.name === 'Imported Questions') {
											return (
												<Route path={ prop2.path } exact
													render={ (props) => (
														<prop2.component
															searchText={ this.state.searchText }
															searchImportedQuestions={ click => this.searchImportedQuestions = click } { ...props }
														/>) }
												/>
											);
										} else if (prop2.name === 'Submitted For Publication') {
											return (
												<Route path={ prop2.path } exact
													render={ (props) => (
														<prop2.component
															searchText={ this.state.searchText }
															searchSubmittedQuestions={ click => this.searchSubmittedQuestions = click } { ...props }
														/>) }
												/>
											);
										} else {
											return (
												<Route path={ prop2.path } component={ prop2.component } key={ key2 } />
											);
										}
									});
								}
								if (prop.redirect)
									return (
										<Redirect from={ prop.path } searchText={ this.state.searchText } to={ prop.pathTo } key={ key } />
									);
								return (
									<Route path={ prop.path } component={ prop.component } key={ key } />
								);
							})
						}
					</Switch>
					{
						// we don't want the Footer to be rendered on full screen maps page
						this.props.location.pathname.indexOf('full-screen-maps') !== -1 ? null : <Footer fluid />
					}
				</div>
			</div>
		);
	}
}

export default Dashboard;
