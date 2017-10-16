import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Input} from 'nti-web-commons';
import {buffer} from 'nti-commons';

const INPUT_BUFFER = 500;

export default class SearchProviderInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string,
		onChange: PropTypes.func,
		onChangeStart: PropTypes.func,
		onChangeEnd: PropTypes.func
	}


	constructor (props) {
		super(props);

		const {value} = props;

		this.state = {
			value
		};

		this.bufferedChange = buffer(INPUT_BUFFER, () => this.onChange());
	}


	componentWillReceiveProps (nextProps) {
		const {value: nextValue} = nextProps;
		const {value: prevValue} = this.props;

		if (nextValue !== prevValue) {
			this.setState({
				value: nextValue
			});
		}
	}


	onChange = () => {
		const {value} = this.state;
		const {onChange, onChangeEnd} = this.props;

		if (onChange) {
			onChange(value);
		}

		if (onChangeEnd) { onChangeEnd(); }
	}


	onInputChange = (value) => {
		const {onChangeStart} = this.props;


		this.setState({value}, () => {
			if (onChangeStart) { onChangeStart(); }

			this.bufferedChange();
		});
	}


	render () {
		const {className} = this.props;
		const {value} = this.state;

		return (
			<div className={cx('search-provider-input', className)}>
				<Input.Text value={value} onChange={this.onInputChange} />
			</div>
		);
	}
}
