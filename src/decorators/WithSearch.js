import React from 'react';
import PropTypes from 'prop-types';

import { HOC } from '@nti/lib-commons';
import { useForceUpdate } from '@nti/web-core';

import SearchStore from '../Store';

let seen = 0;

const getStore = scope =>
	scope ? SearchStore.getForScope(scope) : SearchStore.getGlobal();

SearchableWrapper.propTypes = {
	_searchableId: PropTypes.string,
	_scope: PropTypes.string,
	_label: PropTypes.string,
	_component: PropTypes.any,
	_componentRef: PropTypes.any,
};
function SearchableWrapper({
	_searchableId: id,
	_scope: scope,
	_label: label,
	_component: Cmp,
	_componentRef: forwardRef,

	...otherProps
}) {
	const store = React.useMemo(() => getStore(scope), [scope]);
	const forceUpdate = useForceUpdate();
	const searchTerm = store?.searchTerm;

	React.useEffect(() => {
		store.addChangeListener(forceUpdate);

		if (label) {
			store.addContext(id, label);
		}

		return () => {
			store.removeChangeListener(forceUpdate);

			if (label) {
				store.removeContext(id, label);
			}
		};
	}, [store, id, label]);

	return <Cmp searchTerm={searchTerm} {...otherProps} />;
}

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

	const Wrapper = (props, ref) => (
		<SearchableWrapper
			_searchableId={context(props, id)}
			_scope={scope}
			_label={typeof label === 'function' ? label(props) : label}
			_component={Cmp}
			_componentRef={ref}
			{...props}
		/>
	);

	const searchCmp = React.forwardRef(Wrapper);

	const componentName = Cmp.displayName || Cmp.name;
	const name = `${componentName}(Searchable)`;

	HOC.hoistStatics(searchCmp, Cmp, name);

	return searchCmp;
}
