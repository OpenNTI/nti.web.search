import PropTypes from 'prop-types';

import Connector from '@nti/lib-store-connector';

import Store from '../Store';

import View from './View';

ContextConnector.propTypes = {
	store: PropTypes.object,
};
export default function ContextConnector({ store, ...otherProps }) {
	store = store || Store.getGlobal();

	return (
		<Connector _store={store} _propMap={{ searchTerm: 'searchTerm' }}>
			<View {...otherProps} store={store} />
		</Connector>
	);
}
