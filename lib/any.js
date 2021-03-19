'use strict';

/**
 * @typedef {import('r-assign').TransformFunction} TransformFunction
 */

/**
 * @typedef {import('r-assign/lib').TypeGuard} TypeGuard
 */

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property ${key} is not expected to be undefined`;
};

/**
 * Check for non-undefined values
 * @type {TypeGuard}
 */
const isAny = (value) => {

	return (typeof value !== 'undefined');
};

/**
 * Creator of transform functions for non-undefined values
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
 * Transform function to validate non-undefined values
 * @type {TransformFunction}
 */
const parseAny = (value, key) => {

	// Check for non-undefined values to validate them
	if (!isAny(value)) {
		throw new TypeError(invalidPropertyType(key));
	}

	return value;
};

module.exports = {
	getAny,
	isAny,
	parseAny
};