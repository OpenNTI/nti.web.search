import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	results: 'Results for "%(term)s"',
	clear: 'Clear Search'
};

const t = scoped('nti-web-search.context-indicator', DEFAULT_TEXT);

export default class SearchContextIndicator extends React.Component {
	static propTypes = {
		store: PropTypes.object,
		searchTerm: PropTypes.string,
		backLabel: PropTypes.string
	}


	clearSearchTerm = () => {
		const {store} = this.props;

		store.setTerm('');
	}


	render () {
		const {searchTerm, backLabel} = this.props;

		if (!searchTerm) {
			return null;
		}

		return (
			<div className="search-context-indicator">
				{backLabel && (
					<div className="back" onClick={this.clearSearchTerm}>
						<i className="icon-chevron-left" />
						<span>{backLabel}</span>
					</div>
				)}
				<div className="results-for">
					<span>{t('results', {term: searchTerm})}</span>
				</div>
			</div>
		);
	}
}
