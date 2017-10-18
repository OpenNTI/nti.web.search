import React from 'react';
import PropTypes from 'prop-types';

import {searchable, contextual} from '../../src';

import Store from './TestStore';

const store = new Store();

@contextual('Test CMP')
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
