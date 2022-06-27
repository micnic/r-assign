'use strict';

const {
	invalidInitialValue,
	invalidValue
} = require('r-assign/lib/internal/invalid-type');
const { setTypeGuardMeta } = require('r-assign/lib/internal/type-guard-meta');

/**
 * @template [T = any]
 * @typedef {import('r-assign').TransformFunction<T>} TransformFunction
 */

/**
 * @template [T = any]
 * @typedef {import('r-assign/lib').TG<T>} TypeGuard
 */

/**
 * Check for string values
 * @type {TypeGuard<string>}
 */
const isString = (value) => (typeof value === 'string');

// Save type guard meta
setTypeGuardMeta(isString, {
	annotation: 'string',
	classification: 'primitive',
	description: 'a string value',
	primitive: 'string'
});

/**
 * Transform any value to string
 * @deprecated will be removed in version 2.0, use "asString()" instead
 * @type {TransformFunction<string>}
 */
const convertToString = (value) => {

	// Check for string values
	if (isString(value)) {
		return value;
	}

	return String(value);
};

/**
 * Extract string values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {string} [initial]
 * @returns {TransformFunction<string>}
 */
const getString = (initial = '') => {

	// Check for default value to be a string
	if (!isString(initial)) {
		throw TypeError(invalidInitialValue(isString, initial));
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
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<string>}
 */
const parseString = (value, key) => {

	// Check for string values to validate them
	if (!isString(value)) {
		throw TypeError(invalidValue(isString, value, key));
	}

	return value;
};

module.exports = {
	asString: convertToString,
	convertToString,
	getString,
	isString,
	parseString,
	string: isString
};