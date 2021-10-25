import React from 'react';

import { scoped } from '@nti/lib-locale';
import { Input } from '@nti/web-commons';

const t = scoped('web-search.input', {
	placeholder: 'Search',
	placeholderWithContext: 'Search %(context)s',
});

/** @typedef {(value: string) => void} ChangeHandler */

/**
 * @param {object} props
 * @param {string=} props.value
 * @param {ChangeHandler=} props.onChange
 * @param {string=} props.context
 * @returns {JSX.Element}
 */
export default React.forwardRef(function SearchProviderInput(
	{ value, onChange, context, ...otherProps },
	ref
) {
	const placeholder = context
		? t('placeholderWithContext', { context })
		: t('placeholder');

	return (
		<Input.Text
			data-testid="search"
			{...otherProps}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			ref={ref}
		/>
	);
});
