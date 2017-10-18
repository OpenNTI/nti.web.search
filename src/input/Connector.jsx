import React from 'react';
import PropTypes from 'prop-types';
import Connector from 'nti-lib-store-connector';

import Store from '../Store';

import Input from './Input';

const propMap = {
	searchTerm: 'value',
	context: 'context'
};

export default class SearchInputConnector extends React.Component {
	static propTypes = {
		store: PropTypes.object,
		scope: PropTypes.string,
		onChange: PropTypes.func
	}


	get searchStore () {
		const {store, scope} = this.props;

		return store ? store : resolveStore(scope);
	}


	onChange = (value) => {
		const {searchStore} = this;

		searchStore.setTerm(value);
	}


	render () {
		const {searchStore} = this;
		const {...otherProps} = this.props;

		delete otherProps.store;
		delete otherProps.scope;

		return (
			<Connector _store={searchStore} _propMap={propMap}>
				<Input {...otherProps} onChange={this.onChange} />
			</Connector>
		);
	}
}

function resolveStore (scope) {
	return scope ? Store.getForScope(scope) : Store.getGlobal();
}
