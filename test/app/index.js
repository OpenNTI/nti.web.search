import React from 'react';
import ReactDOM from 'react-dom';

import {Input, ContextIndicator} from '../../src';

import TestCmp from './TestCmp';


window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};


function Test () {
	return (
		<div className="search-test">
			<Input />
			<ContextIndicator backLabel="Show All Users"/>
			<TestCmp />
		</div>
	);
}



ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
