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
 * Check for boolean values
 * @type {TypeGuard<boolean>}
 */
const isBoolean = (value) => {

	return (typeof value === 'boolean');
};

// Save type guard meta
setTypeGuardMeta(isBoolean, {
	annotation: 'boolean',
	classification: 'primitive',
	description: 'a boolean value'
});

/**
 * Extract boolean values
 * @param {boolean} [initial]
 * @returns {TransformFunction<boolean>}
 */
const getBoolean = (initial = false) => {

	// Check for default value to be a boolean
	if (!isBoolean(initial)) {
		throw TypeError(invalidPropertyType(isBoolean, true, initial));
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
		throw TypeError(invalidPropertyType(isBoolean, false, value, key));
	}

	return value;
};

module.exports = {
	getBoolean,
	isBoolean,
	parseBoolean
};