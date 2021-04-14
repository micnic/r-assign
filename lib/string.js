'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const invalidDefaultValue = 'Invalid default value, string expected';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property ${key} is expected to be a string`;
};

/**
 * Check for string values
 * @type {TypeGuard<string>}
 */
const isString = (value) => {

	return (typeof value === 'string');
};

/**
 * Extract string values
 * @param {string} [initial]
 * @returns {TransformFunction<string>}
 */
const getString = (initial = '') => {

	// Check for default value to be a string
	if (!isString(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Just return string values
		if (isString(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract and validate string values
 * @type {TransformFunction<string>}
 */
const parseString = (value, key) => {

	// Check for string values to validate them
	if (!isString(value)) {
		throw new TypeError(invalidPropertyType(key));
	}

	return value;
};

module.exports = {
	getString,
	isString,
	parseString
};