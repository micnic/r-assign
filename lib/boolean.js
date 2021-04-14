'use strict';

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

const invalidDefaultValue = 'Invalid default value, boolean expected';

/**
 * Returns message for invalid property type error
 * @param {string} key
 * @returns {string}
 */
const invalidPropertyType = (key) => {
	return `Property ${key} is expected to be a boolean`;
};

/**
 * Check for boolean values
 * @type {TypeGuard<boolean>}
 */
const isBoolean = (value) => {

	return (typeof value === 'boolean');
};

/**
 * Extract boolean values
 * @param {boolean} [initial]
 * @returns {TransformFunction<boolean>}
 */
const getBoolean = (initial = false) => {

	// Check for default value to be a boolean
	if (!isBoolean(initial)) {
		throw TypeError(invalidDefaultValue);
	}

	return (value) => {

		// Just return boolean values
		if (isBoolean(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract and validate boolean values
 * @type {TransformFunction<boolean>}
 */
const parseBoolean = (value, key) => {

	// Check for boolean values to validate them
	if (!isBoolean(value)) {
		throw new TypeError(invalidPropertyType(key));
	}

	return value;
};

module.exports = {
	getBoolean,
	isBoolean,
	parseBoolean
};