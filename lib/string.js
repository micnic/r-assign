'use strict';

const {
	invalidPropertyType,
	setTypeGuardMeta
} = require('r-assign/lib/common');

/**
 * @template T
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template T
 * @typedef {import('r-assign/lib').TypeGuard<T>} TypeGuard
 */

/**
 * Check for string values
 * @type {TypeGuard<string>}
 */
const isString = (value) => {

	return (typeof value === 'string');
};

// Save type guard meta
setTypeGuardMeta(isString, {
	annotation: 'string',
	classification: 'primitive',
	description: 'a string value'
});

/**
 * Extract string values
 * @param {string} [initial]
 * @returns {TransformFunction<string>}
 */
const getString = (initial = '') => {

	// Check for default value to be a string
	if (!isString(initial)) {
		throw TypeError(invalidPropertyType(isString, true, initial));
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
		throw TypeError(invalidPropertyType(isString, false, value, key));
	}

	return value;
};

module.exports = {
	getString,
	isString,
	parseString
};