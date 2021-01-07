import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Input} from '@nti/web-commons';

const DEFAULT_TEXT = {
	placeholder: 'Search',
	placeholderWithContext: 'Search %(context)s'
};

const t = scoped('web-search.input', DEFAULT_TEXT);

export default class SearchProviderInput extends React.Component {
	static propTypes = {
		value: PropTypes.string,
		onChange: PropTypes.func,

		context: PropTypes.string
	}


	attachInputRef = x => this.input = x;

	focus () {
		if (this.input) {
			this.input.focus();
		}
	}

	onChange = (value) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value);
		}
	}


	render () {
		const {value, context, ...otherProps} = this.props;
		const placeholder = context ? t('placeholderWithContext', {context}) : t('placeholder');

		return (
			<Input.Text
				data-testid="search"
				{...otherProps}
				value={value}
				onChange={this.onChange}
				placeholder={placeholder}
				ref={this.attachInputRef}
			/>
		);
	}
}
