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

const { isFinite } = Number;

/**
 * Check for number values
 * @type {TypeGuard<number>}
 */
const isAnyNumber = (value) => (typeof value === 'number');

// Save type guard meta
setTypeGuardMeta(isAnyNumber, {
	annotation: 'number',
	classification: 'primitive',
	description: 'a number value',
	main: isAnyNumber,
	primitive: 'number'
});

/**
 * Check for finite number values
 * @type {TypeGuard<number>}
 */
const isNumber = (value) => (isAnyNumber(value) && isFinite(value));

// Save type guard meta
setTypeGuardMeta(isNumber, {
	annotation: 'number',
	classification: 'primitive',
	description: 'a finite number value',
	main: isNumber,
	primitive: 'number'
});

/**
 * Extract number values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {number} [initial]
 * @returns {TransformFunction<number>}
 */
const getAnyNumber = (initial = 0) => {

	// Check for default value to be a number
	if (!isAnyNumber(initial)) {
		throw TypeError(invalidInitialValue(isAnyNumber, initial));
	}

	return (value) => {

		// Just return number values
		if (isAnyNumber(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract finite number values
 * @deprecated will be removed in version 2.0, use `getType()` instead
 * @param {number} [initial]
 * @returns {TransformFunction<number>}
 */
const getNumber = (initial = 0) => {

	// Check for default value to be a number
	if (!isNumber(initial)) {
		throw TypeError(invalidInitialValue(isNumber, initial));
	}

	return (value) => {

		// Just return number values
		if (isNumber(value)) {
			return value;
		}

		return initial;
	};
};

/**
 * Extract and validate number values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<number>}
 */
const parseAnyNumber = (value, key) => {

	// Check for number values to validate them
	if (!isAnyNumber(value)) {
		throw TypeError(invalidValue(isAnyNumber, value, key));
	}

	return value;
};

/**
 * Extract and validate finite number values
 * @deprecated will be removed in version 2.0, use `parseType()` instead
 * @type {TransformFunction<number>}
 */
const parseNumber = (value, key) => {

	// Check for number values to validate them
	if (!isNumber(value)) {
		throw TypeError(invalidValue(isNumber, value, key));
	}

	return value;
};

module.exports = {
	anyNumber: isAnyNumber,
	getAnyNumber,
	getNumber,
	isAnyNumber,
	isNumber,
	number: isNumber,
	parseAnyNumber,
	parseNumber
};