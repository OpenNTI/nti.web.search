import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Input} from 'nti-web-commons';

export default class SearchProviderInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string,
		onChange: PropTypes.func
	}


	onChange = () => {
		const {onChange} = this.props;
		const {value} = this.state;

		if (onChange) {
			onChange(value);
		}
	}

	render () {
		const {className, value} = this.props;

		return (
			<div className={cx('search-provider-input', className)}>
				<Input.Text value={value} onChange={this.onChange} />
			</div>
		);
	}
}
