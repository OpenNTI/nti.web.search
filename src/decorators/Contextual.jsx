import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/lib-commons';

import SearchStore from '../Store';

let seen = 0;

export class Contextual extends React.Component {
	static propTypes = {
		'contextual-label': PropTypes.string.isRequired,
		'contextual-id': PropTypes.string.isRequired,

		component: PropTypes.any,
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
		const {component, children, ...otherProps} = this.props;

		delete otherProps['contextual-id'];
		delete otherProps['contextual-label'];

		return component ?
			React.createElement(component, otherProps) :
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
					{...props}
					contextual-label={label}
					contextual-id={id}
					component={component}
				/>
			);
		};

		return HOC.hoistStatics(cmp, component, 'ContextualSearch');
	};
}
