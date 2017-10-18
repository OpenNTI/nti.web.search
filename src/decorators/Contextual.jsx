import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from 'nti-commons';

import SearchStore from '../Store';

let seen = 0;

export class Contextual extends React.Component {
	static propTypes = {
		'contextual-label': PropTypes.string.isRequired,
		'contextual-id': PropTypes.string.isRequired,

		_component: PropTypes.any,
		children: PropTypes.element
	}

	constructor (props) {
		super(props);

		this.searchStore = SearchStore.getGlobal();
	}


	componentDidMount () {
		const {['contextual-id']:id, ['contextual-label']:label} = this.props;

		this.searchStore.addContext(id, label);
	}


	componentWillUnmount () {
		const {['contextual-id']:id, ['contextual-label']:label} = this.props;

		this.searchStore.removeContext(id, label);
	}


	render () {
		const {_component, children, ...otherProps} = this.props;

		delete otherProps['contextual-id'];
		delete otherProps['contextual-label'];

		return _component ?
			React.createElement(_component, otherProps) :
			React.cloneElement(React.Children.only(children), otherProps);
	}
}

export function contextual (label) {
	const id = seen.toString();

	seen += 1;

	return function decorator (component) {
		const cmp = (props) => {
			return (
				<Contextual
					contextual-label={label}
					contextual-id={id}
					_component={component}
				/>
			);
		};

		return HOC.hoistStatics(cmp, component, 'ContextualSearch');
	};
}

