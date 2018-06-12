import React from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import {
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import { PagesHeader, Footer } from 'components';
import pagesRoutes from 'routes/pages.jsx';

var ps;


/**
 * Pages class component
 * @extends {React}
 */
class Pages extends React.Component{
	/**
	 * React lifeCycle hook when component ready
	 */
	componentDidMount(){
		if(navigator.platform.indexOf('Win') > -1){
			ps = new PerfectScrollbar(this.refs.fullPages);
		}
	}

	/**
	 * React lifeCycle hook when component getting destroy
	 */
	componentWillUnmount(){
		if(navigator.platform.indexOf('Win') > -1){
			ps.destroy();
		}
	}

	/**
	 * Renders the component.
	 *
	 * @return {string} - HTML markup for the component
	 */
	render(){
		return (
			<div>
				<PagesHeader { ...this.props }/>
				<div className="wrapper wrapper-full-page" ref="fullPages">
					<div className="full-page section-image">
						<Switch>
							{
								pagesRoutes.map((prop,key) => {
									if(prop.redirect)
										return (
											<Redirect from={ prop.path } to={ prop.pathTo } key={ key }/>
										);
									return (
										<Route path={ prop.path } component={ prop.component }  key={ key }/>
									);
								})
							}
						</Switch>
						<Footer fluid/>
					</div>
				</div>
			</div>
		);
	}
}

export default Pages;
