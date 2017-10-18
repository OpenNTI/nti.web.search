import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Input} from 'nti-web-commons';

const DEFAULT_TEXT = {
	placeholder: 'Search',
	placeholderWithContext: 'Search %(context)s'
};

const t = scoped('nti-web-search.input', DEFAULT_TEXT);

export default class SearchProviderInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string,
		onChange: PropTypes.func,

		context: PropTypes.string
	}


	onChange = (value) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value);
		}
	}


	render () {
		const {className, value, context} = this.props;
		const placeholder = context ? t('placeholderWithContext', {context}) : t('placeholder');

		return (
			<div className={cx('search-provider-input', className)}>
				<Input.Text value={value} onChange={this.onChange} placeholder={placeholder} />
			</div>
		);
	}
}
