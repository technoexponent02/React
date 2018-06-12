import React from 'react';
import { Container } from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types';

class Footer extends React.Component{
	render(){
		return (
			<footer className={ 'footer'
                + (this.props.default ? ' footer-default':'')
			}
			>
				<Container fluid={ this.props.fluid ? true:false }>
					<div className="row">
						<div className="col-md-6">
							<nav>
								<ul>
									<li>
										<a href="http://physician.life">
                                            physician.life
										</a>
									</li>
									<li>
										<a href="http://physician.life/about">
                                        About Us
										</a>
									</li>
									<li>
										<a href="http://physician.life/blog">
                                        Blog
										</a>
									</li>
								</ul>
							</nav>
						</div>
						<div className="col-md-6 text-right">
							<div className="Copyright">
                                &copy; {1900 + (new Date()).getYear()}, Designed by physician.life.
							</div>
						</div>
					</div>
                    
				</Container>
			</footer>
		);
	}
}

Footer.propTypes = {
	default: PropTypes.bool,
	fluid: PropTypes.bool
};

export default Footer;
