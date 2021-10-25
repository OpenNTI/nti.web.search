import React, { useImperativeHandle, useRef } from 'react';

import Connector from '@nti/lib-store-connector';

import Store from '../Store';

import Input from './Input';

const resolveStore = scope =>
	scope ? Store.getForScope(scope) : Store.getGlobal();

const propMap = {
	searchTerm: 'value',
	context: 'context',
};

// static propTypes = {
// 	store: PropTypes.object,
// 	scope: PropTypes.string,
// 	onChange: PropTypes.func,
// };

export default React.forwardRef(function SearchInputConnector(
	{ store, scope, ...props },
	ref
) {
	const input = useRef();
	const _store = store || resolveStore(scope);

	useImperativeHandle(ref, () => ({
		get searchStore() {
			return _store;
		},

		focus() {
			input.current?.focus();
		},

		clear() {
			_store.setTerm('');
		},

		get value() {
			return input.current?.value;
		},
	}));

	const onChange = value => {
		_store.setTerm(value);
		props.onChange?.(value);
	};

	return (
		<Connector _store={_store} _propMap={propMap}>
			<Input {...props} onChange={onChange} ref={input} />
		</Connector>
	);
});
