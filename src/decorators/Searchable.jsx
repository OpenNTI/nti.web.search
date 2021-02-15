import React from 'react';
import PropTypes from 'prop-types';
import { HOC } from '@nti/lib-commons';
import StoreConnector from '@nti/lib-store-connector';

import SearchStore from '../Store';

function getSearchStore(scope) {
	if (scope) {
		return SearchStore.getForScope(scope);
	}

	return SearchStore.getGlobal();
}

class SearchableStore extends React.Component {
	/**
	 * TODO: Migrate all uses of this to the new system
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
	 * @returns {Function} A Composed Component
	 */
	static connect(store, component, propMap, onMount, onUnmount) {
		const cmp = React.forwardRef((props, ref) => (
			<SearchableStore
				{...props}
				_forwardedRef={ref}
				_store={store}
				_propMap={propMap}
				_component={component}
				_onMount={onMount}
				_onUnmount={onUnmount}
			/>
		));

		cmp.displayName = `SearchableConnected[${
			component.name || component.displayName
		}]`;

		return HOC.hoistStatics(cmp, component, 'SearchableStoreConnector');
	}

	static propTypes = {
		_forwardedRef: PropTypes.any,
		_store: PropTypes.object,
	};

	constructor(props) {
		super(props);

		this.searchStore = SearchStore.getGlobal();
	}

	componentDidMount() {
		this.searchStore.addChangeListener(this.onStoreChange);
	}

	componentWillUnmount() {
		this.searchStore.removeChangeListener(this.onStoreChange);
	}

	updateSearchTerm() {
		const { _store } = this.props;

		if (_store && _store.updateSearchTerm) {
			_store.updateSearchTerm(this.searchStore.searchTerm);
		}
	}

	onStoreChange = ({ type }) => {
		if (type === 'searchTerm') {
			this.updateSearchTerm();
		}
	};

	render() {
		const { _forwardedRef, ...otherProps } = this.props;

		return <StoreConnector {...otherProps} ref={_forwardedRef} />;
	}
}

export class Searchable extends React.Component {
	static connect = SearchableStore.connect;

	static propTypes = {
		scope: PropTypes.string,
		children: PropTypes.element,
	};

	state = {};

	componentDidMount() {
		this.setup(this.props);
	}

	componentDidUpdate(prevProps) {
		const { scope } = this.props;
		const { scope: prevScope } = prevProps;

		if (prevScope !== scope) {
			this.setup(this.props);
		}
	}

	componentWillUnmount() {
		this.unmounted = true;

		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	setup(props) {
		const { scope } = this.props;
		const store = getSearchStore(scope);

		this.setState({
			store,
		});

		if (this.unsubscribe) {
			this.unsubscribe();
		}

		store.addChangeListener(this.onStoreChange);

		this.unsubscribe = () => {
			store.removeChangeListener(this.onStoreChange);
			delete this.unsubscribe;
		};
	}

	onStoreChange = () => {
		if (!this.unmounted) {
			this.forceUpdate();
		}
	};

	render() {
		const { children } = this.props;
		const { store } = this.state;
		const searchTerm = store ? store.searchTerm : null;

		return React.cloneElement(React.Children.only(children), {
			searchTerm,
		});
	}
}

// Decorators are being removed in favor of composition & hooks.
export function searchable(scope, propMap) {
	if (scope && typeof scope !== 'string') {
		return component => {
			return SearchableStore.connect(scope, component, propMap);
		};
	}

	return Component => {
		const cmp = React.forwardRef((props, ref) => {
			return (
				<Searchable scope={scope}>
					<Component ref={ref} {...props} />
				</Searchable>
			);
		});

		cmp.displayName = `SearchableDecorator[${
			Component.name || Component.displayName
		}]`;

		HOC.hoistStatics(cmp, Component, 'Searchable');

		return cmp;
	};
}
