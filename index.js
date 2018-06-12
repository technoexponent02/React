import React from 'react';
import ReactDOM from 'react-dom';


import { createStore } from 'redux';
import { Provider } from 'react-redux';

import allReducer from './reducers';

import { createBrowserHistory } from 'history';
import {
	Router,
	Route,
	Switch
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'assets/scss/now-ui-dashboard.css?v=1.0.1';
import 'assets/css/demo.css';

import { hot } from 'react-hot-loader';


import indexRoutes from 'routes/index.jsx';

import Raven from 'raven-js';
import { sentry_url } from './helpers/SentryConfig';

// Raven init
Raven.config(sentry_url).install();



const hist = createBrowserHistory();

setInterval(() => {
	if(window.navigator.onLine){
		document.getElementsByTagName('body')[0].classList.remove('offline');
	} else {
		document.getElementsByTagName('body')[0].classList.add('offline');
	}
}, 1500);



const store = createStore(
	allReducer,
	window.devToolsExtension && window.devToolsExtension()
);


ReactDOM.render(
	<Provider store={ store }>
		<div>
			<div id="offline">
                You have no internet. Please check your internet connection.
			</div>
			<Router history={ hist }>
				<Switch>
					{
						indexRoutes.map((prop,key) => {
							return (
								<Route path={ prop.path } key={ key } component={ prop.component } />
							);
						})
					}
				</Switch>
			</Router>
		</div>
	</Provider>
	, document.getElementById('root'));

export default hot(module)(indexRoutes);
