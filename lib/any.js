'use strict';

const { invalidPropertyType } = require('r-assign/lib/common');

/**
 * @typedef {import('r-assign').TransformFunction} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib').TypeGuard} TypeGuard
 */

const valueType = 'a non-undefined value';

/**
 * Check for non-undefined values
 * @type {TypeGuard}
 */
const isAny = (value) => {

	return (typeof value !== 'undefined');
};

/**
 * Extract non-undefined values
 * @param {any} [initial]
 * @returns {TransformFunction}
 */
const getAny = (initial) => {

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
		throw new TypeError(invalidPropertyType(key, valueType));
	}

	return value;
};

module.exports = {
	getAny,
	isAny,
	parseAny
};