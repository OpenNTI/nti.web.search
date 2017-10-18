import React from 'react';
import PropTypes from 'prop-types';

import {searchable} from '../../src';

import Store from './TestStore';

const store = new Store();

@searchable(store, {items: 'items'})
export default class TestCmp extends React.Component {
	static propTypes = {
		items: PropTypes.array
	}

	render () {
		const {items} = this.props;

		return (
			<ul>
				{items.map((x, index) => (<li key={index}>{x}</li>))}
			</ul>
		);
	}
}
