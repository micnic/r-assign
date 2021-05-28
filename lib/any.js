'use strict';

const {
	invalidPropertyType,
	setTypeGuardMeta
} = require('r-assign/lib/common');

/**
 * @typedef {import('r-assign').TransformFunction} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib').TypeGuard} TypeGuard
 */

/**
 * Check for non-undefined values
 * @type {TypeGuard}
 */
const isAny = (value) => {

	return (typeof value !== 'undefined');
};

// Save type guard meta
setTypeGuardMeta(isAny, {
	annotation: 'any',
	children: null,
	classification: 'any',
	description: 'a non-undefined value'
});

/**
 * Extract non-undefined values
 * @param {any} [initial]
 * @returns {TransformFunction}
 */
const getAny = (initial) => {

	if (!isAny(initial)) {
		throw TypeError(invalidPropertyType(isAny, true, initial));
	}

	return (value) => {

		// Just return non-undefined values
		if (isAny(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract and validate non-undefined values
 * @type {TransformFunction}
 */
const parseAny = (value, key) => {

	// Check for non-undefined values to validate them
	if (!isAny(value)) {
		throw TypeError(invalidPropertyType(isAny, false, value, key));
	}

	return value;
};

module.exports = {
	getAny,
	isAny,
	parseAny
};