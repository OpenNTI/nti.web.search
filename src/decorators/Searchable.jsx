import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/lib-commons';
import StoreConnector from '@nti/lib-store-connector';

import SearchStore from '../Store';

export class Searchable extends React.Component {

	/**
	 * Used to compose a Component Class. This returns a new Component Type.
	 *
	 * This is intended to be incorporated into a store's connect() decorator,
	 * and not meant to be used directly as a decorator.
	 *
	 * @param  {Object} store The store to connect to.
	 * @param  {Class} component The component to compose & wire to store updates.
	 * @param  {Object} propMap mapping of key from store to a a prop name.
	 *                          Ex:
	 *                          {
	 *                              'AppUser': 'user',
	 *                              'AppName': 'title',
	 *                          }
	 * @param  {Function} onMount A callback after the component mounts. Handy to dynamically build stores or load data.
	 * @param  {Function} onUnmount A callback before the component unmounts.
	 * @return {Function} A Composed Component
	 */
	static connect (store, component, propMap, onMount, onUnmount) {
		const cmp = React.forwardRef((props, ref) => (
			<Searchable
				{...props}
				_forwardedRef={ref}
				_store={store}
				_propMap={propMap}
				_component={component}
				_onMount={onMount}
				_onUnmount={onUnmount}
			/>
		));

		return HOC.hoistStatics(cmp, component, 'SearchableStoreConnector');
	}

	static propTypes = {
		_forwardedRef: PropTypes.any,
		_store: PropTypes.object
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
		const {_store} = this.props;

		if (_store && _store.updateSearchTerm) {
			_store.updateSearchTerm(this.searchStore.searchTerm);
		}
	}


	onStoreChange = ({type}) => {
		if (type === 'searchTerm') {
			this.updateSearchTerm();
		}
	}


	render () {
		const {
			_forwardedRef,
			...otherProps
		} = this.props;

		return (
			<StoreConnector {...otherProps} ref={_forwardedRef}/>
		);
	}
}


/**
 * @deprecated Use Searchable.connect() in a store's connect decorator instead.
 * @method searchable
 * @param  {Object}   store   The store that implements the searchable interfaces
 * @param  {Object}   propMap A mapping of store values to propNames to apply to the component.
 * @return {Function} A decorator that returns a Composed Component
 */
export function searchable (store, propMap) {
	return (component) => (
		// I want this warning to be visible no matter what...hence, the disabled lint line.
		// DO NOT do this for your debug console logging.
		console.warn( //eslint-disable-line no-console
			'Do not use @searchable() decorator, use a store’s connect decorator instead.\nCaused by: %o',
			component.name || component.displayName || component
		),
		Searchable.connect(store, component, propMap));
}
