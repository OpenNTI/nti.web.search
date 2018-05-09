import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/lib-commons';
import StoreConnector from '@nti/lib-store-connector';

import SearchStore from '../Store';

export class Searchable extends React.Component {
	static propTypes = {
		'searchable-store': PropTypes.object,
		'searchable-propMap': PropTypes.object,

		_component: PropTypes.any,
		children: PropTypes.element,
		forwardedRef: PropTypes.any
	}


	constructor (props) {
		super(props);

		this.searchStore = SearchStore.getGlobal();
	}


	componentDidMount () {
		this.searchStore.addChangeListener(this.onStoreChange);
	}


	componentWillUnmount () {
		this.searchStore.removeChangeListener(this.onStoreChange);
	}


	updateSearchTerm () {
		const {['searchable-store']: store} = this.props;

		if (store && store.updateSearchTerm) {
			store.updateSearchTerm(this.searchStore.searchTerm);
		}
	}


	onStoreChange = ({type}) => {
		if (type === 'searchTerm') {
			this.updateSearchTerm();
		}
	}


	render () {
		const {
			['searchable-store']:store,
			['searchable-propMap']:propMap,
			forwardedRef,
			...otherProps
		} = this.props;

		return (
			<StoreConnector _store={store} _propMap={propMap} {...otherProps} ref={forwardedRef}/>
		);
	}
}


export function searchable (store, propMap) {
	return function decorator (component) {
		const SearchableComposer = React.forwardRef((props, ref) => (
			<Searchable
				{...this.props}
				searchable-store={store}
				searchable-propMap={propMap}
				_component={component}
			/>
		));


		return HOC.hoistStatics(SearchableComposer, component, 'Searchable');
	};
}
