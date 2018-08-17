import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/lib-commons';

import SearchStore from '../Store';

function getSearchStore (scope) {
	if (scope) {
		return SearchStore.getForScope(scope);
	}

	return SearchStore.getGlobal();
}

export class Searchable extends React.Component {
	static propTypes = {
		scope: PropTypes.string,
		children: PropTypes.element
	}

	state = {}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {scope} = this.props;
		const {scope:prevScope} = prevProps;

		if (prevScope !== scope) {
			this.setupFor(this.props);
		}
	}


	componentWillUnmount () {
		this.unmounted = true;

		if (this.unsubscribe) {

		}
	}


	setupFor (props) {
		const {scope} = this.props;
		const store = getSearchStore(scope);

		this.setState({
			store
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
	}


	render () {
		const {children} = this.props;
		const {store} = this.state;
		const searchTerm = store ? store.searchTerm : null;

		return (
			React.cloneElement(React.Children.only(children), {searchTerm});
		);
	}
}

export function searchable (scope) {
	if (typeof scoped !== 'string') { throw new Error('The only argument to the searchable decorator is the scope to search in'); }

	return (Component) => {
		const cmp = React.forwardRef((props, ref) => {
			return (
				<Searchable scope={scope}>
					<Component ref={ref} />
				</Searchable>
			);
		});


		HOC.hoistStatics(cmp, Component, 'Searchable');

		return cmp;
	}
}
