import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
	Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem,
	Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
	Container, InputGroup, InputGroupAddon, Input
} from 'reactstrap';

import dashboardRoutes from 'routes/dashboard.jsx';

class Header extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			dropdownOpen: false,
			userDropdownOpen: false,
			color: 'transparent',
			logedIn: false
		};
		this.toggle = this.toggle.bind(this);
		this.dropdownToggle = this.dropdownToggle.bind(this);
		this.userDropdownToggle = this.userDropdownToggle.bind(this);
	}
	toggle() {
		if(this.state.isOpen){
			this.setState({
				color: 'transparent'
			});
		} else {
			this.setState({
				color: 'white'
			});
		}
		this.setState({
			isOpen: !this.state.isOpen
		});
	}
	dropdownToggle(e){
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}


	userDropdownToggle(e){
		this.setState({
			userDropdownOpen: !this.state.userDropdownOpen
		});
	}


	getBrand(){
		var name;
		dashboardRoutes.map((prop,key) => {
			if(prop.collapse){
				prop.views.map((prop,key) => {
					if(prop.path === this.props.location.pathname){
						name = prop.name;
					}
					return null;
				});
			} else {
				if(prop.redirect){
					if(prop.path === this.props.location.pathname){
						name = prop.name;
					}
				}else{
					if(prop.path === this.props.location.pathname){
						name = prop.name;
					}
				}
			}
			return null;
		});
		return name;
	}
	openSidebar(){
		document.documentElement.classList.toggle('nav-open');
		this.refs.sidebarToggle.classList.toggle('toggled');
	}
	// function that adds color white/transparent to the navbar on resize (this is for the collapse)
	updateColor(){
		if(window.innerWidth < 993 && this.state.isOpen){
			this.setState({
				color: 'white'
			});
		} else {
			this.setState({
				color: 'transparent'
			});
		}

	}

	componentDidMount(){
		window.addEventListener('resize', this.updateColor.bind(this));
	}
	componentDidUpdate(e){
		if(window.innerWidth < 993 && e.history.location.pathname !== e.location.pathname && document.documentElement.className.indexOf('nav-open') !== -1){
			document.documentElement.classList.toggle('nav-open');
			this.refs.sidebarToggle.classList.toggle('toggled');
		}
	}

	/**
     * @description this will make logout from the application
     */
	makeLogout() {
		if(localStorage.getItem('Token') && localStorage.getItem('UserInfo')) {
			localStorage.removeItem('Token');
			localStorage.removeItem('UserInfo');
			this.setState({logedIn: true});
		}
	}


	render(){
		return (
		// add or remove classes depending if we are on full-screen-maps page or not
			<div>
				<Navbar
					color={ this.props.location.pathname.indexOf('full-screen-maps') !== -1 ? 'white':this.state.color } expand="lg"
					className={
						this.props.location.pathname.indexOf('full-screen-maps') !== -1 ?
							'navbar-absolute fixed-top':'navbar-absolute fixed-top ' + (this.state.color === 'transparent' ? 'navbar-transparent ':'') }
				>

					{this.state.logedIn ? <Redirect to="/"/> : '' }

					<Container fluid>
						<div className="navbar-wrapper">
							<div className="navbar-toggle">
								<button type="button" ref="sidebarToggle" className="navbar-toggler" onClick={ () => this.openSidebar() }>
									<span className="navbar-toggler-bar bar1"></span>
									<span className="navbar-toggler-bar bar2"></span>
									<span className="navbar-toggler-bar bar3"></span>
								</button>
							</div>
							<NavbarBrand href="/">{this.getBrand()}</NavbarBrand>
						</div>
						<NavbarToggler onClick={ this.toggle }>
							<span className="navbar-toggler-bar navbar-kebab"></span>
							<span className="navbar-toggler-bar navbar-kebab"></span>
							<span className="navbar-toggler-bar navbar-kebab"></span>
						</NavbarToggler>
						<Collapse isOpen={ this.state.isOpen } navbar className="justify-content-end">
							<form onSubmit={ this.props.onSearchButtonClick.bind(this) }>
								<InputGroup className="no-border onDesktopSearch">
									<Input value={ this.props.searchText } onChange={ this.props.onSearchTextChange.bind(this) }
										placeholder="Search Questions..."
									/>
									<InputGroupAddon  onClick={ this.props.onSearchButtonClick.bind(this) }>
										<i className="now-ui-icons ui-1_zoom-bold"></i></InputGroupAddon>
								</InputGroup>
							</form>
							<Nav navbar>
								<Dropdown nav isOpen={ this.state.userDropdownOpen } toggle={ (e) => this.userDropdownToggle(e) }>
									<DropdownToggle caret nav>
										<i className="now-ui-icons users_single-02"></i>
										<p>
											<span className="d-lg-none d-md-block">Account</span>
										</p>
									</DropdownToggle>
									<DropdownMenu right>
										<DropdownItem tag="a" href="javascript:void(0);" onClick={ this.makeLogout.bind(this) }>
                                                Logout
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>

								{/* <NavItem>
                                    <Link to="#pablo" className="nav-link">
                                        <i className="now-ui-icons users_single-02"></i>
                                        <p>
                                            <span className="d-lg-none d-md-block">Account</span>
                                        </p>
                                    </Link>
                                </NavItem> */}

								{/* <NavItem>
                                    <a href="javascript:void(0);" onClick={this.makeLogout.bind(this)} className="nav-link logout">
                                        <i className="fa fa-power-off"></i>
                                        <p>Logout</p>
                                    </a>
                                </NavItem> */}

							</Nav>
						</Collapse>
					</Container>
                    
				</Navbar>

				<div className="mobile-search">
					<form onSubmit={ this.props.onSearchButtonClick.bind(this) }>
						<InputGroup className="no-border">
							<Input value={ this.props.searchText } onChange={ this.props.onSearchTextChange.bind(this) }
								placeholder="Search Questions..."
							/>
							<InputGroupAddon  onClick={ this.props.onSearchButtonClick.bind(this) }>
								<i className="now-ui-icons ui-1_zoom-bold"></i></InputGroupAddon>
						</InputGroup>
					</form>
				</div>

			</div>
		);
	}
}

export default Header;
