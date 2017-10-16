import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from '../../src';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

ReactDOM.render(
	React.createElement(Provider.Input, {}),
	document.getElementById('content')
);
