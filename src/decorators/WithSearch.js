import React, { useEffect } from 'react';

import { HOC } from '@nti/lib-commons';
import { useForceUpdate } from '@nti/web-core';

import SearchStore from '../Store';

let seen = 0;

const getStore = scope =>
	scope ? SearchStore.getForScope(scope) : SearchStore.getGlobal();

const useStore = (scope, id, label) => {
	const store = getStore(scope);
	if (label) {
		store?.removeContext(id);
		store?.addContext(id, label);
	}

	useEffect(() => () => label && store.removeContext(id), [label, id, store]);

	const forceUpdate = useForceUpdate();
	useEffect(() => {
		const changed = e => {
			if (e.type === 'searchTerm') {
				forceUpdate();
			}
		};
		store.addChangeListener(changed);
		return () => void store.removeChangeListener(changed);
	}, [store]);

	return store;
};

/**
 * Pass the current search term to a composed component
 *
 * @param {Object} Cmp component to pass the search term to
 * @param {Object} param1 generate an id for the search context name
 * @param {Function} param1.context generate an id for the search context name
 * @param {Function} param1.label user visible label fo the context
 * @param {string} param1.scope scope to look for the search input in (default: global)
 * @returns {Object} wrapper around Cmp that will pass Cmp the search term
 */
export function WithSearch(Cmp, { context = (_, id) => id, label, scope }) {
	const id = `search-${seen.toString()}`;
	seen += 1;

	const searchCmp = React.forwardRef((props, ref) => {
		const _searchableId = context(props, id);
		const _label = typeof label === 'function' ? label(props) : label;
		const store = useStore(scope, _searchableId, _label);

		return <Cmp {...props} ref={ref} searchTerm={store?.searchTerm} />;
	});

	const componentName = Cmp.displayName || Cmp.name;
	const name = `${componentName}(Searchable)`;

	HOC.hoistStatics(searchCmp, Cmp, name);

	return searchCmp;
}
