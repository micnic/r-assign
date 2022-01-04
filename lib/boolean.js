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
 * Check for boolean values
 * @type {TypeGuard<boolean>}
 */
const isBoolean = (value) => (typeof value === 'boolean');

// Save type guard meta
setTypeGuardMeta(isBoolean, {
	annotation: 'boolean',
	classification: 'primitive',
	description: 'a boolean value',
	main: isBoolean,
	primitive: 'boolean'
});

/**
 * Extract boolean values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {boolean} [initial]
 * @returns {TransformFunction<boolean>}
 */
const getBoolean = (initial = false) => {

	// Check for default value to be a boolean
	if (!isBoolean(initial)) {
		throw TypeError(invalidInitialValue(isBoolean, initial));
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
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<boolean>}
 */
const parseBoolean = (value, key) => {

	// Check for boolean values to validate them
	if (!isBoolean(value)) {
		throw TypeError(invalidValue(isBoolean, value, key));
	}

	return value;
};

module.exports = {
	boolean: isBoolean,
	getBoolean,
	isBoolean,
	parseBoolean
};