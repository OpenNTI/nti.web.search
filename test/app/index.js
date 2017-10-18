import React from 'react';
import ReactDOM from 'react-dom';

import {Input} from '../../src';

import TestCmp from './TestCmp';

import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};


function Test () {
	return (
		<div className="search-test">
			<Input />
			<TestCmp />
		</div>
	);
}



ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
