import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Collapse } from 'reactstrap';
// react plugin for creating notifications over the dashboard
import NotificationAlert from 'react-notification-alert';
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from 'perfect-scrollbar';

import { Button } from 'components';
import userPage from '../../routes/userPage.jsx';
import avatar from 'assets/img/ryan.jpg';
import logo from 'logo-white.svg';

var ps;

class Sidebar extends React.Component{
	constructor(props){
		console.log(userPage);
		super(props);
		this.state = {
			openAvatar: false,
			openComponents: (this.activeRoute('/components') !== '' ? true:false),
			openForms: (this.activeRoute('/forms') !== '' ? true:false),
			openTables: (this.activeRoute('/tables') !== '' ? true:false),
			openMaps: (this.activeRoute('/maps') !== '' ? true:false),
			openPages: (this.activeRoute('/pages') !== '' ? true:false),
			openUsers: (this.activeRoute('/users') !== '' ? true:false),
			openQuestions: (this.activeRoute('/sourceQuestions') !== '' ? true:false),
			userInfo: {
				firstName: '',
				lastName: ''
			}
		};
		this.activeRoute.bind(this);
		this.minimizeSidebar = this.minimizeSidebar.bind(this);
	}
	// verifies if routeName is the one active (in browser input)
	activeRoute(routeName) {
		return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
	}
	minimizeSidebar(){
		var message = 'Sidebar mini ';
		if(document.body.classList.contains('sidebar-mini')){
			message += 'deactivated...';
		} else {
			message += 'activated...';
		}
		document.body.classList.toggle('sidebar-mini');
		var options = {};
		options = {
			place: 'tr',
			message: message,
			type: 'info',
			icon: 'now-ui-icons ui-1_bell-53',
			autoDismiss: 7
		};
		// this.refs.notificationAlert.notificationAlert(options);
	}

	getUserInfo() {
		if(JSON.parse(localStorage.getItem('UserInfo'))!=null){
			const data = {
				firstName: JSON.parse(localStorage.getItem('UserInfo')).firstName,
				lastName: JSON.parse(localStorage.getItem('UserInfo')).lastName
			};
			this.setState({userInfo: data});
		}
	}

	componentDidMount(){
		if(navigator.platform.indexOf('Win') > -1){
			ps = new PerfectScrollbar(this.refs.sidebar,{suppressScrollX: true, suppressScrollY: false});
		}

		// get the user info
		this.getUserInfo();
	}

	componentWillUnmount(){
		if(navigator.platform.indexOf('Win') > -1){
			ps.destroy();
		}
	}

	render(){
		return (
			<div>
				<NotificationAlert ref="notificationAlert"/>
				<div className="sidebar" data-color="blue">
					<div id="sidebarLoad"></div>
					<div className="logo">
                	<a href="/" className="simple-text logo-mini">
							<div className="logo-img">
								<img src={ logo } alt="react-logo" />
							</div>
                	</a>
                	<a href="/" className="simple-text logo-normal">
                        Physician Life
                	</a>
						<div className="navbar-minimize">
							<Button simple neutral icon round id="minimizeSidebar" onClick={ this.minimizeSidebar }>
								<i className="now-ui-icons text_align-center visible-on-sidebar-regular"></i>
								<i className="now-ui-icons design_bullet-list-67 visible-on-sidebar-mini"></i>
							</Button>
						</div>
					</div>
					<div className="sidebar-wrapper" ref="sidebar">
						<div className="user">
							<div className="photo">
								<img src={ avatar } alt="Avatar"/>
							</div>
							<div className="info">
								<a data-toggle="collapse" aria-expanded={ this.state.openAvatar } onClick={ ()=> this.setState({ openAvatar: !this.state.openAvatar }) }>
									<span className="loginnameleft">
										<span className="loginname">{this.state.userInfo.firstName} {this.state.userInfo.lastName}</span>
										<b className="caret"></b>
									</span>
								</a>
								<Collapse isOpen={ this.state.openAvatar }>
									<ul className="nav">
										<li>
											<NavLink to={ this.props.userRoutes[0].path } activeClassName="active">
												<span className="sidebar-mini-icon">{this.props.userRoutes[0].mini}</span>
												<span className="sidebar-normal">{this.props.userRoutes[0].name}</span>
											</NavLink>
										</li>
									</ul>
								</Collapse>
							</div>
						</div>
						<Nav>
							{
								this.props.routes.map((prop,key) => {
									if(prop.redirect)
										return null;
									if(prop.collapse){
										var st = {};
										st[prop['state']] = !this.state[prop.state];
										return (
											<li className={ this.activeRoute(prop.path) } key={ key }>
												<a data-toggle="collapse" aria-expanded={ this.state[prop.state] } onClick={ () => this.setState(st) }>
													<i className={ 'now-ui-icons '+prop.icon }></i>
													<p>{prop.name}
														<b className="caret"></b>
													</p>
												</a>
												<Collapse isOpen={ this.state[prop.state] }>
													<ul className="nav">
														{
															prop.views.map((prop,key) => {
																if(prop.redirect)
																	return null;
																return (
																	<li className={ this.activeRoute(prop.path) } key={ key }>
																		<NavLink to={ prop.path } activeClassName="active">
																			<span className="sidebar-mini-icon">{prop.mini}</span>
																			<span className="sidebar-normal">{prop.name}</span>
																		</NavLink>
																	</li>
																);
															})
														}
													</ul>
												</Collapse>
											</li>
										);
									}
									return (
										<li className={ this.activeRoute(prop.path) } key={ key }>
											<NavLink to={ prop.path } className="nav-link" activeClassName="active">
												<i className={ 'now-ui-icons '+prop.icon }></i>
												<p>{prop.name}</p>
											</NavLink>
										</li>
									);
								})
							}
						</Nav>
					</div>
				</div>
			</div>
		);
	}
}

export default Sidebar;
